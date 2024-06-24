import { Request, Response, NextFunction } from "express";
import { getAllAttendees } from "../services/attendeeService";

export const allAttendees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attendees = await getAllAttendees();

        res.json({ attendees });
    } catch (err) {
        next(err);
    }
};
