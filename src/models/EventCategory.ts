import { Schema, model, Document } from "mongoose";

export interface IEventCategory extends Document {
    name: string;
}

const categorySchema = new Schema<IEventCategory>(
    {
        name: {
            type: String,
            required: true,
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

const EventCategory = model<IEventCategory>("Category", categorySchema);

export default EventCategory;
