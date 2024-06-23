import { NextFunction, Request, Response } from "express";
import BusUser from "../models/UserBus";
import asyncWrapper from "../utils/asyncWrapper";
import AppError from "../errors/AppError";

export async function subscribe(req: Request, res: Response, next: NextFunction) {
    const { busLineId , userId } = req.body;

    const busUserData = {
        busLineId,
        userId
    };

    const [error, newBusUser] = await asyncWrapper(BusUser.create(busUserData));

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.status(201).json(newBusUser);
}
export async function unsubscribe(req: Request, res: Response, next: NextFunction) {
    const { busLineId, userId } = req.body;

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