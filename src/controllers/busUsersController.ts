import { NextFunction, Request, Response } from "express";
import BusUser from "../models/UserBus";
import asyncWrapper from "../utils/asyncWrapper";
import AppError from "../errors/AppError";
import { AuthenticatedRequest } from "../middlewares/authenticateUser";


export async function subscribe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { busLineId } = req.body;
    const userId = req.user;

    const [error, updatedBusUser] = await asyncWrapper(
        BusUser.findOneAndUpdate(
            { userId: userId },
            { busLineId: busLineId },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        )
    );

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.status(201).json(updatedBusUser);
}



export async function unsubscribe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { busLineId } = req.body;
    const userId = req.user;

    const [error, result] = await asyncWrapper(BusUser.findOneAndDelete({ busLineId, userId }));

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    if (!result) {
        return next(new AppError("Subscription not found.", 404));
    }

    res.status(200).json({ message: "Successfully unsubscribed." });
}

export async function getAllBusUsers(req: Request, res: Response, next: NextFunction) {

    const { busLineId } = req.params;

    const [error, busUsers] = await asyncWrapper(BusUser.find({ busLineId }));

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.status(200).json(busUsers);
}