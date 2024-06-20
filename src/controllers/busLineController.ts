import { NextFunction, Request, Response } from "express";
import BusLine from "../models/BusLine";
import asyncWrapper from "../utils/asyncWrapper";
import AppError from "../errors/AppError";
import DataValidationError from "../errors/DataValidationError";

export async function createBusLine(req: Request, res: Response, next: NextFunction) {
    // const { name, isActive, capacity } = req.body;

    // const busLineData = {
    //     name,
    //     isActive,
    //     capacity,
    // };

    // const [error, newBusLine] = await asyncWrapper(BusLine.create(busLineData));

    // if (error) {
    //     if (error instanceof ValidationError) {
    //         return next(new DataValidationError(error));
    //     }

    //     if (error instanceof UniqueConstraintError) {
    //         return next(new AppError("Bus line already exists. Please use a different name", 409));
    //     }

    //     return next(new AppError("Database error. Please try again later."));
    // }

    // res.status(201).json(newBusLine);
}


export async function getBusLines(req: Request, res: Response) {
    // const [error, busLines] = await asyncWrapper(BusLine.findAll());


    // if (error) {
    //     res.status(500).json(error);
    // }

    // res.status(200).json(busLines);
}


export async function getBusLineById(req: Request, res: Response, next: NextFunction) {
    // const { id } = req.params;

    // const [error, busLine] = await asyncWrapper(BusLine.findByPk(id));

    // if (error) {
    //     return next(new AppError("Database error. Please try again later."));
    // }


    // if (!busLine) {
    //     return next(new AppError("Bus Line not found", 404));
    // }

    // res.status(200).json(busLine);
}


export async function updateBusLine(req: Request, res: Response, next: NextFunction) {
    // const { id } = req.params;
    // const { name, isActive, capacity } = req.body;


    // const [error, updatedBusLine] = await asyncWrapper(BusLine.update(
    //     {
    //         name, isActive, capacity
    //     },
    //     {
    //         where: {
    //             id,
    //         },
    //         returning: true,
    //     },
    // ));

    // if (error) {
    //     if (error instanceof ValidationError) {
    //         return next(new DataValidationError(error));
    //     }

    //     return next(new AppError("Database error. Please try again later."));
    // }

    // if(!updatedBusLine[0]){
    //     return next(new AppError("Bus Line not found", 404));
    // }

    // res.status(200).json(updatedBusLine);
}


export async function deleteBusLine(req: Request, res: Response, next: NextFunction) {

    // const { id } = req.params;

    // const [error, deletedRows] = await asyncWrapper(BusLine.destroy({
    //     where: {
    //         id
    //     },
    // }));

    // if (error) {
    //     return next(new AppError("Database error. Please try again later."));
    // }

    // if(!deletedRows){
    //     return next(new AppError("Bus Line not found", 404));
    // }

    // res.status(204).send();
}
