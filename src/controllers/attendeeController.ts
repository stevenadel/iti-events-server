import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import {
    deleteAttendeeById,
    getAllAttendees,
    getAttendeeById,
    updateAttendeeApprovalStatus,
} from "../services/attendeeService";
import ValidationError from "../errors/ValidationError";
import NotFoundError from "../errors/NotFoundError";

export const allAttendees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendees = await getAllAttendees();

        res.json({ attendees });
    } catch (err) {
        next(err);
    }
};

export const pendingAttendees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendees = await getAllAttendees(false);

        res.json({ attendees });
    } catch (err) {
        next(err);
    }
};

export const attendeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { attendeeId } = req.params;

        if (!isValidObjectId(attendeeId)) {
            next(new ValidationError("Invalid attendee id format"));
            return;
        }

        const attendee = await getAttendeeById(attendeeId);

        if (!attendee) {
            next(new NotFoundError("Attendee Not Found"));
            return;
        }

        res.json({ attendee });
    } catch (err) {
        next(err);
    }
};

export const approveAttendee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { attendeeId } = req.params;
        if (!isValidObjectId(attendeeId)) {
            next(new ValidationError("Invalid attendee id format"));
            return;
        }

        const attendee = await updateAttendeeApprovalStatus(attendeeId, true);

        if (!attendee) {
            next(new NotFoundError("Attendee does not exist"));
            return;
        }

        res.json({ attendee });
    } catch (err) {
        next(err);
    }
};

export const rejectAttendee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { attendeeId } = req.params;
        if (!isValidObjectId(attendeeId)) {
            next(new ValidationError("Invalid attendee id format"));
            return;
        }

        const attendee = await updateAttendeeApprovalStatus(attendeeId, false);

        if (!attendee) {
            next(new NotFoundError("Attendee does not exist"));
            return;
        }

        res.json({ attendee });
    } catch (err) {
        next(err);
    }
};

export const deleteAttendee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { attendeeId } = req.params;
        if (!isValidObjectId(attendeeId)) {
            next(new ValidationError("Invalid attendee id format"));
            return;
        }

        const attendee = await deleteAttendeeById(attendeeId);

        if (!attendee) {
            next(new NotFoundError("Attendee does not exist"));
            return;
        }

        res.status(200).json({ attendee });
    } catch (err) {
        next(err);
    }
};
