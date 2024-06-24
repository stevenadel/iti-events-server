import EventAttendee from "../models/EventAttendee";

export const getAllAttendees = async () => {
    const attendees = await EventAttendee.find().populate("user").populate("event");
    return attendees;
};

export const getAttendeeById = async (id: string) => {
    const attendee = await EventAttendee.findById(id).populate("user").populate("event");
    return attendee;
};
