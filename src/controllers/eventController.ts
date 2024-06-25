import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import asyncWrapper from "../utils/asyncWrapper";
import Event from "../models/Event";
import EventCategory from "../models/EventCategory";
import ValidationError from "../errors/ValidationError";
import isObjectIdValid from "../utils/mongoose";
import NotFoundError from "../errors/NotFoundError";
import { AuthenticatedRequest } from "../middlewares/authenticateUser";
import {
    deleteEventAttendee,
    getActiveEndedBeforeDate,
    getActiveEventsAtDate,
    getActiveEventsStartsAfterDate,
    getAllEventsService,
    getEvent,
    getEventAttendees,
    isUserRegisteredInEvent,
    registerUserInEvent,
} from "../services/eventService";
import { uploadImageToCloud } from "../utils/cloudinary";
import AppError from "../errors/AppError";

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

export const allEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await getAllEventsService();

        res.json({ events });
    } catch (err) {
        next(err);
    }
};

export const eventsHappening = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currDate = new Date();
        const events = await getActiveEventsAtDate(currDate);

        res.json({ events });
    } catch (err) {
        next(err);
    }
};

export const upComingEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentDate = new Date();

        const events = await getActiveEventsStartsAfterDate(currentDate);

        res.json({ events });
    } catch (err) {
        next(err);
    }
};

export const finishedEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentDate = new Date();

        const events = await getActiveEndedBeforeDate(currentDate);

        res.json({ events });
    } catch (err) {
        next(err);
    }
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

export const attendEvent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { eventId } = req.params;
        const { id: userId } = req.user;

        if (!isValidObjectId(eventId)) {
            next(new ValidationError("Invalid event id"));
            return;
        }

        const isRegistered = await isUserRegisteredInEvent(userId, eventId);

        if (isRegistered) {
            next(new ValidationError("User is already registered in this event"));
            return;
        }

        const event = await getEvent(eventId);

        if (!event) {
            next(new NotFoundError("Event doesn't exist"));
            return;
        }

        if (!event.isPaid) {
            const attendee = await registerUserInEvent(userId, eventId);
            res.status(201).json({ attendee });
            return;
        }
        let imageUrl: string | null = null;
        let cloudinaryPublicId : string | null = null;

        if (req.file?.buffer) {
            const [uploadErr, result] = await asyncWrapper(uploadImageToCloud(req.file?.buffer));
            if (uploadErr) {
                next(new AppError(`Couldn't upload image cause of : ${uploadErr.message}`));
                return;
            }

            if (result) {
                imageUrl = result.secure_url;
                cloudinaryPublicId = result.public_id;
            }
        }

        const attendee = await registerUserInEvent(userId, eventId, true, { imageUrl, cloudinaryPublicId });

        res.status(201).json({ attendee });
    } catch (err) {
        next(err);
    }
};

export const missEvent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { eventId } = req.params;
        const { id: userId } = req.user;

        if (!isValidObjectId(eventId)) {
            next(new ValidationError("Invalid event id"));
            return;
        }

        const deletedForm = await deleteEventAttendee(userId, eventId);

        if (!deletedForm) {
            next(new NotFoundError("You are not registered to this event"));
            return;
        }

        res.status(204).json({ message: "Deleted Successfully" });
    } catch (err) {
        next(err);
    }
};

export const eventAttendees = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { eventId } = req.params;
        if (!isValidObjectId(eventId)) {
            next(new ValidationError("Invalid event id format"));
            return;
        }

        const attendees = await getEventAttendees(eventId);

        res.json({ attendees });
    } catch (err) {
        next(err);
    }
};
