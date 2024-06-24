import EventAttendee from "../models/EventAttendee";

export const getAllAttendees = async () => {
    const attendees = await EventAttendee.find().populate("user").populate("event");
    return attendees;
};
