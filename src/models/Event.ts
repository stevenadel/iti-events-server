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
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
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

eventSchema.virtual("endDate").get(function (this: IEvent) {
    const endDate = new Date(this.startDate);
    endDate.setHours(endDate.getHours() + this.duration); // hours is unit of measurement
    return endDate;
});

const Event = model<IEvent>("Event", eventSchema);

export default Event;
