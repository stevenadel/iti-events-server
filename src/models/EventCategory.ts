import { Schema, model, Document } from "mongoose";

export interface IEventCategory extends Document {
    name: string;
    imageUrl: string | null;
    cloudinaryPublicId: string | null;
}

const categorySchema = new Schema<IEventCategory>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        imageUrl: {
            type: String,
            default: null,
        },
        cloudinaryPublicId: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret.cloudinaryPublicId;
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
 *           description: The auto-generated id of the event category
 *         name:
 *           type: string
 *           description: The name of the event category
 *         imageUrl:
 *           type: ['string', 'null']
 *           description: The URL of the image associated with the event category
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the event category was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the event category was last updated
 *       example:
 *         id: 60c72b2f9b1e8c3f10a4d2b1
 *         name: Concerts
 *         imageUrl: http://example.com/image.jpg
 *         createdAt: 2023-06-23T14:48:00.000Z
 *         updatedAt: 2023-06-23T14:48:00.000Z
 */
