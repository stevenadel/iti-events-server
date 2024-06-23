import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import User from "../models/User";
import asyncWrapper from "../utils/asyncWrapper";
import { AuthenticatedRequest } from "../middlewares/authenticateUser";

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    const [error, users] = await asyncWrapper(User.find());

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.json(users);
}

export async function getMe(req: AuthenticatedRequest, res:Response, next: NextFunction) {
    const { id } = req.user;
    const [error, user] = await asyncWrapper(User.findById(id).exec());

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.json(user);
}
