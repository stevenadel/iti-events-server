import { Document, Schema } from "mongoose";
import Receipt from "./Receipt";

export default interface EventAttendee extends Document {
    userId: Schema.Types.ObjectId;
    eventId: Schema.Types.ObjectId;
    isApproved: boolean;
    receipt: Receipt;
};
