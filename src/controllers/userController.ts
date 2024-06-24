import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../utils/asyncWrapper";
import User from "../models/User";
import AppError from "../errors/AppError";
import DataValidationError from "../errors/DataValidationError";
import NotFoundError from "../errors/NotFoundError";
import { AuthenticatedRequest } from "../middlewares/authenticateUser";

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    const [error, users] = await asyncWrapper(User.find());

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.json(users);
}

export async function getMe(req: AuthenticatedRequest, res:Response, next: NextFunction) {
    res.json({ user: req.user });
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid user ID format.", 400));
    }

    const [error, user] = await asyncWrapper(User.findById(id));

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    if (!user) {
        return next(new NotFoundError("User not found."));
    }

    res.json(user);
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
    const userData = req.body;

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

    res.status(201).json(newUser);
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid user ID format.", 400));
    }

    if (updateData.password) {
        if (updateData.password.length < 8 || updateData.password.length > 25) {
            return next(new AppError("Password must be between 8 and 25 characters long.", 422));
        }
    }

    const [error, updatedUser] = await asyncWrapper(
        User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }),
    );

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

    if (!updatedUser) {
        return next(new NotFoundError("User not found."));
    }

    res.json(updatedUser);
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid user ID format.", 400));
    }

    const [error, deletedUser] = await asyncWrapper(User.findByIdAndDelete(id));

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    if (!deletedUser) {
        return next(new NotFoundError("User not found."));
    }

    res.status(204).send();
}
