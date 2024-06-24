import { Schema, model } from "mongoose";
import Receipt from "../types/Receipt";
import IEventForm from "../types/EventForm";

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

const EventFormSchema = new Schema<IEventForm>(
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

EventFormSchema.virtual("user", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true,
});

EventFormSchema.virtual("event", {
    ref: "Event",
    localField: "eventId",
    foreignField: "_id",
    justOne: true,
});

const EventForm = model<IEventForm>("EventForm", EventFormSchema);

export default EventForm;

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
 *     EventFormPopulated:
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
 *     EventForm:
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
