import mongoose from "mongoose";

export default function isObjectIdValid(id: string) {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return true;
    }

    return false;
}
