import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import asyncWrapper from "../utils/asyncWrapper";
import User from "../models/User";
import { UserAuth } from "../types/User";

export interface AuthenticatedRequest extends Request {
    user?: typeof User.prototype;
}

const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return next(new AppError("Access token required.", 401));
    }

    const [error, decoded] = await asyncWrapper<UserAuth | null>(
        new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_ACCESS_SECRET!, (err, decodedToken) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decodedToken as UserAuth);
                }
            });
        }),
    );

    if (error) {
        return next(new AppError("Invalid or expired access token.", 403));
    }

    const [userError, user] = await asyncWrapper(
        User.findById(decoded!.id),
    );

    if (userError) {
        return next(new AppError("Database error. Please try again later."));
    }

    if (!user) {
        return next(new AppError("User not found.", 404));
    }

    req.user = user;
    next();
};

export default authenticateUser;
