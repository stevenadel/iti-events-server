import { NextFunction, Request, Response } from "express";
import { ValidationError } from "sequelize";
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
        if (error instanceof ValidationError) {
            const uniqueError = error.errors.find((err) => err.type === "unique violation");
            const allowNullError = error.errors.find((err) => err.validatorKey === "notNull Violation");

            if (uniqueError) {
                return next(new AppError("Email already exists. Please use a different email.", 409));
            }

            if (allowNullError) {
                return next(new DataValidationError(error, 400));
            }

            return next(new DataValidationError(error));
        }

        return next(new AppError("Database error. Please try again later."));
    }

    res.status(201).json(newUser);
}

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    const [error, users] = await asyncWrapper(User.findAll());

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.json(users);
}
