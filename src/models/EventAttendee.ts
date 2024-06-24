import { Schema, model } from "mongoose";
import Receipt from "../types/Receipt";
import IEventAttendee from "../types/EventAttendee";

const ReceiptSchema = new Schema<Receipt>({
    imageUrl: {
        type: String,
        default: null,
    },
    cloudinaryPublicId: {
        type: String,
        default: null,
    },
}, {
    _id: false,
});

const EventAttendeeSchema = new Schema<IEventAttendee>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        isApproved: {
            type: Boolean,
            default: true,
        },
        receipt: {
            type: ReceiptSchema,
            default: {},
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret.receipt.cloudinaryPublicId;
                delete ret.userId;
                delete ret.eventId;
                delete ret.__v;
                delete ret._id;
            },
        },
        toObject: {
            virtuals: true,
        },
    },
);

EventAttendeeSchema.virtual("user", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true,
});

EventAttendeeSchema.virtual("event", {
    ref: "Event",
    localField: "eventId",
    foreignField: "_id",
    justOne: true,
});

const EventAttendee = model<IEventAttendee>("EventAttendee", EventAttendeeSchema);

export default EventAttendee;

/**
 * @swagger
 * components:
 *   schemas:
 *     Receipt:
 *       type: object
 *       properties:
 *         imageUrl:
 *           type: string
 *           description: URL to receipt image
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     EventAttendeePopulated:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated id for the form
 *         receipt:
 *           $ref: '#/components/schemas/Receipt'
 *         user:
 *           $ref: '#/components/schemas/User'
 *         event:
 *           $ref: '#/components/schemas/Event'
 *
 *     EventAttendee:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *             description: Auto-generated id for the form
 *           receipt:
 *             $ref: '#/components/schemas/Receipt'
 *           userId:
 *             type: string
 *             description: Auto-generated id of the user
 *           eventId:
 *             type: string
 *             description: Auto-generated id of the event
 */
