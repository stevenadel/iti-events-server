import { NextFunction, Request, Response } from "express";
import BusLine from "../models/UserBus";
import asyncWrapper from "../utils/asyncWrapper";
import AppError from "../errors/AppError";

export async function subscribe(req: Request, res: Response, next: NextFunction) {
    console.log("hii")
    const { busLineId , userId } = req.body;

    const busUserData = {
        busLineId,
        userId
    };

    const [error, newBusUser] = await asyncWrapper(BusLine.create(busUserData));

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.status(201).json(newBusUser);
}

