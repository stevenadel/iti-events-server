import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../utils/asyncWrapper";
import Event from "../models/Event";
import EventCategory from "../models/EventCategory";
import ValidationError from "../errors/ValidationError";
import isObjectIdValid from "../utils/mongoose";
import NotFoundError from "../errors/NotFoundError";

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

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.id;

    if (!isObjectIdValid(eventId)) {
        next(new ValidationError("Invalid event id format"));
        return;
    }

    const [err, event] = await asyncWrapper(Event.findById(eventId).populate("category"));

    if (err) {
        next(err);
        return;
    }

    if (!event) {
        next(new NotFoundError("Event doesn't exist"));
        return;
    }

    res.json({ event });
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.id;
    if (!isObjectIdValid(eventId)) {
        next(new ValidationError("Invalid event id format"));
        return;
    }

    const [findErr, event] = await asyncWrapper(Event.findById(eventId).exec());

    if (findErr) {
        next(findErr);
        return;
    }

    if (!event) {
        next(new NotFoundError("Event not found"));
        return;
    }

    Object.assign(event, req.body);

    const [saveError, updatedEvent] = await asyncWrapper(event.save());

    if (saveError) {
        next(saveError);
        return;
    }

    const [populateError, populatedEvent] = await asyncWrapper(updatedEvent.populate("category"));

    if (populateError) {
        next(populateError);
        return;
    }

    res.json({ event: populatedEvent });
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.id;
    if (!isObjectIdValid(eventId)) {
        next(new ValidationError("Invalid event id format"));
        return;
    }

    const [findErr, event] = await asyncWrapper(Event.findById(eventId).exec());

    if (findErr) {
        next(findErr);
        return;
    }

    if (!event) {
        next(new NotFoundError("Event not found"));
        return;
    }

    const [deleteError] = await asyncWrapper(Event.deleteOne({ _id: eventId }));

    if (deleteError) {
        next(deleteError);
        return;
    }

    res.status(204).send();
};
