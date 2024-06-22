import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../utils/asyncWrapper";
import Event from "../models/Event";
import EventCategory from "../models/EventCategory";
import ValidationError from "../errors/ValidationError";
import isObjectIdValid from "../utils/mongoose";

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { category: categoryId } = req.body;

    if (!isObjectIdValid(categoryId)) {
        next(new ValidationError("Validation Error", { category: "Invalid category id format" }));
        return;
    }

    const [categoryErr, existingCategory] = await asyncWrapper(EventCategory.findById(categoryId));
    if (categoryErr) {
        next(categoryErr);
        return;
    }

    if (!existingCategory) {
        next(new ValidationError("Validation Error", { category: "Category doesn't exist" }));
        return;
    }

    const event = new Event({ ...req.body });
    const [saveErr, savedEvent] = await asyncWrapper(event.save());
    if (saveErr) {
        next(saveErr);
        return;
    }

    res.status(201).json({ event: savedEvent });
};

export const getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
    const [error, events] = await asyncWrapper(
        Event.find()
            .populate("category")
            .exec(),
    );

    if (error) {
        next(error);
        return;
    }

    res.json({ events });
};

export const getCurrentEvents = async (req: Request, res: Response, next: NextFunction) => {
    const currentDate = new Date();

    const [error, events] = await asyncWrapper(
        Event.find({
            endDate: { $gt: currentDate },
            isActive: true,
        })
            .populate("category")
            .exec(),
    );

    if (error) {
        next(error);
        return;
    }

    res.json({ events });
};

export const getFinishedEvents = async (req: Request, res: Response, next: NextFunction) => {
    const currentDate = new Date();

    const [error, events] = await asyncWrapper(
        Event.find({
            endDate: { $lt: currentDate },
            isActive: true,
        })
            .populate("category")
            .exec(),
    );

    if (error) {
        next(error);
        return;
    }

    res.json({ events });
};
