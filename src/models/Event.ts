import { Schema, model, Document } from "mongoose";

interface IEvent extends Document {
    name: string;
    description: string;
    price: number;
    startDate: Date;
    duration: number; // Hours is unit of measurement
    capacity: number;
    registrationClosed: boolean;
    isActive: boolean;
    endDate: Date;
    category: unknown;
    isPaid: boolean
    minAge: number
    maxAge: number
}

const eventSchema = new Schema<IEvent>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            default: 0,
        },
        duration: {
            type: Number,
            default: 24,
        },
        registrationClosed: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        minAge: {
            type: Number,
            default: 18,
        },
        maxAge: {
            type: Number,
            default: 60,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
        },
        endDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
            },
        },
        toObject: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    },
);

eventSchema.pre("save", function (next) {
    this.endDate = new Date(this.startDate);
    this.endDate.setHours(this.endDate.getHours() + this.duration);
    next();
});

const Event = model<IEvent>("Event", eventSchema);

export default Event;

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - startDate
 *         - capacity
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the event
 *         name:
 *           type: string
 *           description: The name of the event
 *         description:
 *           type: string
 *           description: A short description of the event
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: The start date and time of the event
 *         capacity:
 *           type: number
 *           description: The maximum number of attendees for the event
 *         price:
 *           type: number
 *           description: The price of the event (default is 0)
 *         duration:
 *           type: number
 *           description: The duration of the event in hours (default is 24)
 *         registrationClosed:
 *           type: boolean
 *           description: Indicates if registration for the event is closed (default is false)
 *         isActive:
 *           type: boolean
 *           description: Indicates if the event is active (default is true)
 *         isPaid:
 *           type: boolean
 *           description: Indicates if the event is a paid event (default is false)
 *         minAge:
 *           type: number
 *           description: The minimum age requirement for attendees (default is 18)
 *         maxAge:
 *           type: number
 *           description: The maximum age limit for attendees (default is 60)
 *         category:
 *           type: string
 *           description: The category id to which the event belongs
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: The calculated end date and time of the event
 *
 *     EventPopulated:
 *       allOf:
 *         - $ref: '#/components/schemas/Event'
 *         - type: object
 *           properties:
 *             category:
 *               $ref: '#/components/schemas/EventCategory'
 */
