import { NextFunction, Request, Response } from "express";
import BusLine from "../models/BusLine";
import asyncWrapper from "../utils/asyncWrapper";
import AppError from "../errors/AppError";


export async function addBusPoint(req: Request, res: Response, next: NextFunction) {
    const { busLineId } = req.params;
    const newBusPoint = req.body;

    const [error, busLine] = await asyncWrapper(BusLine.findById(busLineId));
    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    if (!busLine) {
        return next(new AppError("Bus Line not found", 404));
    }
    
    busLine.busPoints.push(newBusPoint);

    const [saveError, updatedBusLine] = await asyncWrapper(busLine.save());

    if (saveError) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.status(201).json(updatedBusLine);
}

export async function removeBusPoint(req: Request, res: Response, next: NextFunction) {
    const { busLineId, busPointId } = req.params;

    const [error, busLine] = await asyncWrapper(BusLine.findById(busLineId));
    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    if (!busLine) {
        return next(new AppError("Bus Line not found", 404));
    }

    const busPoint = busLine.busPoints.id(busPointId);
    if (!busPoint) {
        return next(new AppError("Bus Point not found", 404));
    }

    busLine.busPoints.remove(busPoint)

    const [saveError, updatedBusLine] = await asyncWrapper(busLine.save());
    // if (saveError) {
    //     return next(new AppError("Database error. Please try again later."));
    // }

    console.log(saveError)

    res.status(200).json(updatedBusLine);
}

export async function updateBusPoint(req: Request, res: Response, next: NextFunction) {
    const { busLineId, busPointId } = req.params;
    const updates = req.body;

    const [error, busLine] = await asyncWrapper(BusLine.findById(busLineId));
    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    if (!busLine) {
        return next(new AppError("Bus Line not found", 404));
    }

    const busPoint = busLine.busPoints.id(busPointId);
    if (!busPoint) {
        return next(new AppError("Bus Point not found", 404));
    }

    Object.assign(busPoint, updates);

    const [saveError, updatedBusLine] = await asyncWrapper(busLine.save());
    if (saveError) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.status(200).json(updatedBusLine);
}

export async function getAllBusPoints(req: Request, res: Response, next: NextFunction) {
    const { busLineId } = req.params;

    const [error, busLine] = await asyncWrapper(BusLine.findById(busLineId));
    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    if (!busLine) {
        return next(new AppError("Bus Line not found", 404));
    }

    res.status(200).json(busLine.busPoints);
}
