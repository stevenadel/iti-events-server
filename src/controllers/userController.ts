import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import DataValidationError from "../errors/DataValidationError";
import User from "../models/User";
import asyncWrapper from "../utils/asyncWrapper";

export async function login(req: Request, res: Response) {
    res.json({
        loggedIn: "test",
    });
}

export async function register(req: Request, res: Response, next: NextFunction) {
    const userData = req.body;
    const [error, newUser] = await asyncWrapper(User.create(userData));

    if (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const requiredError = Object.values(error.errors).find((err) => err.kind === 'required');
            
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

    res.status(201).json(newUser);
}

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    const [error, users] = await asyncWrapper(User.find());

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.json(users);
}
