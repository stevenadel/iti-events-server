import bcrypt from "bcrypt";
import jwt, { VerifyErrors } from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../utils/asyncWrapper";
import AppError from "../errors/AppError";
import DataValidationError from "../errors/DataValidationError";
import User from "../models/User";
import { UserToken } from "../types/User";

dotenv.config();

const {
    JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION,
} = process.env;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets are not defined in environment variables.");
}

function getTokenPayload(user: UserToken) {
    return {
        id: user.id,
        role: user.role,
    };
}

const generateAccessToken = (user: UserToken) => jwt.sign(getTokenPayload(user), JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });

const generateRefreshToken = (user: UserToken) => jwt.sign(getTokenPayload(user), JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });

export async function login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError("Must provide username and password for login.", 400));
    }

    const [error, user] = await asyncWrapper(User.findOne({ email }));

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    if (!user) {
        return next(new AppError("Invalid email or password.", 401));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return next(new AppError("Invalid email or password.", 401));
    }

    const accessToken = generateAccessToken(user as UserToken);
    const refreshToken = generateRefreshToken(user as UserToken);

    res.json({
        accessToken,
        refreshToken,
    });
}

export async function register(req: Request, res: Response, next: NextFunction) {
    const userData = req.body;
    delete userData.isActive;
    delete userData.role;

    const [error, newUser] = await asyncWrapper(User.create(userData));

    if (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const requiredError = Object.values(error.errors).find((err) => err.kind === "required");

            if (requiredError) {
                return next(new DataValidationError(error, 400));
            }

            return next(new DataValidationError(error));
        }

        if ((error as any).code === 11000) {
            return next(new AppError("Email already exists. Please use a different email.", 409));
        }

        return next(new AppError("Database error. Please try again later."));
    }

    if (newUser.password.length < 8 || newUser.password.length > 25) {
        return next(new AppError("Password must be between 8 and 25 characters long.", 422));
    }

    const accessToken = generateAccessToken(newUser as UserToken);
    const refreshToken = generateRefreshToken(newUser as UserToken);

    res.status(201).json({
        user: newUser,
        accessToken,
        refreshToken,
    });
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError("Refresh token required.", 400));
    }

    const [error, decoded] = await asyncWrapper(
        new Promise((resolve, reject) => {
            jwt.verify(refreshToken, JWT_REFRESH_SECRET!, (err: VerifyErrors | null, decoded: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        }),
    );

    if (error) {
        return next(new AppError("Invalid or expired refresh token.", 403));
    }

    const { id } = decoded as { id: string };
    const [userError, user] = await asyncWrapper(User.findById(id).exec());

    if (userError) {
        return next(new AppError("Database error. Please try again later."));
    }

    if (!user) {
        return next(new AppError("User not found.", 404));
    }

    const newAccessToken = generateAccessToken(user as UserToken);
    res.json({ accessToken: newAccessToken });
}
