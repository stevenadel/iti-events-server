import { isValidObjectId } from "mongoose";
import EventAttendee from "../models/EventAttendee";
import Event from "../models/Event";
import Receipt from "../types/Receipt";
import { deleteImageFromCloud } from "../utils/cloudinary";

export const getAllEventsService = async (isApproved: boolean | undefined = undefined) => {
    const events = await Event.find({ isApproved }).sort({ startDate: 1 }).populate("category");
    return events;
};
export const getEvent = async (eventId:string) => {
    if (!isValidObjectId(eventId)) {
        return null;
    }

    const event = await Event.findById(eventId);
    if (event) {
        return event;
    }

    return null;
};

export const getActiveEventsAtDate = async (currDate: Date) => {
    const events = await Event.find({ startDate: { $lte: currDate }, endDate: { $gte: currDate }, isActive: true }).sort({ startDate: 1 }).populate("category");
    return events;
};
export const getActiveEventsStartsAfterDate = async (currDate: Date) => {
    const events = await Event.find({ startDate: { $gt: currDate }, isActive: true }).sort({ startDate: 1 }).populate("category");
    return events;
};

export const getActiveEndedBeforeDate = async (currDate: Date) => {
    const events = await Event.find({ endDate: { $lt: currDate }, isActive: true }).sort({ startDate: 1 }).populate("category");
    return events;
};

export const isUserRegisteredInEvent = async (userId:string, eventId: string) => {
    const form = await EventAttendee.findOne({ userId, eventId });
    if (form) {
        return true;
    }
    return false;
};

export const registerUserInEvent = async (userId: string, eventId: string, isPaid: boolean = false, receipt: Receipt = { imageUrl: null, cloudinaryPublicId: null }) => {
    const newEventAttendee = new EventAttendee({
        userId, eventId, isApproved: !isPaid, receipt,
    });
    const savedEvent = await newEventAttendee.save();
    await savedEvent.populate("user");
    await savedEvent.populate("event");
    return savedEvent;
};

export const getEventAttendee = async (userId: string, eventId: string) => {
    const form = await EventAttendee.findOne({ userId, eventId });
    return form;
};

export const deleteEventAttendee = async (userId: string, eventId:string) => {
    const deletedForm = await EventAttendee.findOneAndDelete({ userId, eventId });
    if (deletedForm?.receipt.cloudinaryPublicId) {
        await deleteImageFromCloud(deletedForm.receipt.cloudinaryPublicId);
    }
    return deletedForm;
};

export const getEventAttendees = async (eventId: string) => {
    const attendees = await EventAttendee.find({ eventId }).populate("user").populate("event");
    return attendees;
};
