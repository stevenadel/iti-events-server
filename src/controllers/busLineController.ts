import { NextFunction, Request, Response } from "express";
import BusLine from "../models/BusLine";
import asyncWrapper from "../utils/asyncWrapper";
import AppError from "../errors/AppError";

export async function createBusLine(req: Request, res: Response, next: NextFunction) {
    const {
        name, isActive, capacity, busPoints, departureTime, arrivalTime, driverID
    } = req.body;

   

    const busLineData = {
        name,
        isActive,
        capacity,
        busPoints,
        departureTime,
        arrivalTime,
        driverID,
    };

    const [error, newBusLine] = await asyncWrapper(BusLine.create(busLineData));

    console.log(error)

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.status(201).json(newBusLine);
}

export async function getBusLines(req: Request, res: Response, next: NextFunction) {
    const [error, busLines] = await asyncWrapper(BusLine.find().populate("driverID"));

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.status(200).json(busLines);
}

export async function getBusLineById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const [error, busLine] = await asyncWrapper(BusLine.findById(id).populate("driverID"));

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    if (!busLine) {
        return next(new AppError("Bus Line not found", 404));
    }

    res.status(200).json(busLine);
}

export async function updateBusLine(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const {
        name, isActive, capacity, driverID, busPoints,
        departureTime,
        arrivalTime,
    } = req.body;

    const [error, updatedBusLine] = await asyncWrapper(BusLine.findByIdAndUpdate(
        id,
        {
            name,
            isActive,
            capacity,
            driverID,
            busPoints,
            departureTime,
            arrivalTime,
        },
        { new: true },
    ));

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    // if(!updatedBusLine[0]){
    //     return next(new AppError("Bus Line not found", 404));
    // }

    res.status(200).json(updatedBusLine);
}

export async function deleteBusLine(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const [error, deletedRows] = await asyncWrapper(BusLine.findByIdAndDelete(id));

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.status(204).send();
}
