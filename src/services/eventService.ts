import { isValidObjectId } from "mongoose";
import EventForm from "../models/EventForm";
import Event from "../models/Event";
import Receipt from "../types/Receipt";
import { deleteImageFromCloud } from "../utils/cloudinary";

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

export const isUserRegisteredInEvent = async (userId:string, eventId: string) => {
    const form = await EventForm.findOne({ userId, eventId });
    if (form) {
        return true;
    }
    return false;
};

export const registerUserInEvent = async (userId: string, eventId: string, isPaid: boolean = false, receipt: Receipt = { imageUrl: null, cloudinaryPublicId: null }) => {
    const newEventForm = new EventForm({
        userId, eventId, isApproved: !isPaid, receipt,
    });
    const savedEvent = await newEventForm.save();
    await savedEvent.populate("user");
    await savedEvent.populate("event");
    return savedEvent;
};

export const getEventForm = async (userId: string, eventId: string) => {
    const form = await EventForm.findOne({ userId, eventId });
    return form;
};

export const deleteEventForm = async (userId: string, eventId:string) => {
    const deletedForm = await EventForm.findOneAndDelete({ userId, eventId });
    if (deletedForm?.receipt.cloudinaryPublicId) {
        await deleteImageFromCloud(deletedForm.receipt.cloudinaryPublicId);
    }
    return deletedForm;
};
