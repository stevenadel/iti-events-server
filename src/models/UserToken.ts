import mongoose, { Schema } from "mongoose";

const tokenSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    },
);

const UserToken = mongoose.model("UserToken", tokenSchema);

export default UserToken;
