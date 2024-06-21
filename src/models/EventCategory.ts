import { Schema, model, Document } from "mongoose";

export interface IEventCategory extends Document {
    name: string;
}

const categorySchema = new Schema<IEventCategory>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
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

/**
 * @swagger
 * components:
 *   schemas:
 *     EventCategory:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the category was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the category was last updated
 *       example:
 *         id: d5fE_asz
 *         name: Tech
 *         createdAt: 2021-05-14T10:00:00Z
 *         updatedAt: 2021-05-14T10:00:00Z
 */
