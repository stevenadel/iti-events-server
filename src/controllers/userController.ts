import { NextFunction, Request, Response } from "express";
import { UniqueConstraintError, ValidationError } from "sequelize";
import User from "../models/User";
import asyncWrapper from "../utils/asyncWrapper";
import AppError from "../errors/AppError";
import DataValidationError from "../errors/DataValidationError";

export async function login(req: Request, res: Response) {
    res.json({
        loggedIn: "test",
    });
}

export async function register(req: Request, res: Response, next: NextFunction) {
    // dummy data placeholder
    const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: "password",
        isActive: true,
        role: "student",
    };

    const [error, newUser] = await asyncWrapper(User.create(userData));

    if (error) {
        if (error instanceof ValidationError) {
            return next(new DataValidationError(error));
        }

        if (error instanceof UniqueConstraintError) {
            return next(new AppError("Email already exists. Please use a different email", 409));
        }

        return next(new AppError("Database error. Please try again later."));
    }

    res.status(201).json(newUser);
}

export async function getUsers(req: Request, res: Response) {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json(error);
    }
}
