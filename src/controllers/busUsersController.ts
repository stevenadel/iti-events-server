import { NextFunction, Request, Response } from "express";
import BusUser from "../models/UserBus";
import asyncWrapper from "../utils/asyncWrapper";
import AppError from "../errors/AppError";
import { AuthenticatedRequest } from "../middlewares/authenticateUser";
import BusLine from "../models/BusLine";


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

    const [busLineErr, busLine] = await asyncWrapper(BusLine.findById(busLineId));
    
    if (busLineErr || !busLine) {
        return next(new AppError("Bus line not found. Please try again later."));
    }

    if (busLine.remainingSeats == null || busLine.remainingSeats <= 0) {
        return next(new AppError("No remaining seats available."));
    }

    const [busLineError] = await asyncWrapper(
        BusLine.findByIdAndUpdate(
            busLineId,
            { $inc: { remainingSeats: -1 } },
            { new: true }
        )
    );

    if (busLineError) {
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

    const [busLineError] = await asyncWrapper(
        BusLine.findByIdAndUpdate(
            busLineId,
            { $inc: { remainingSeats: 1 } },
            { new: true }
        )
    );

    if (busLineError) {
        return next(new AppError("Database error. Please try again later."));
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