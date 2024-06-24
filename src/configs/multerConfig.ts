import multer from "multer";
import { Request } from "express";
import ValidationError from "../errors/ValidationError";
import Errors from "../types/Errors";

const storage = multer.memoryStorage();

const uploadInMemory = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req: Request, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            const errorsObj: Errors = {};
            errorsObj[file.fieldname] = "Invalid image format";
            cb(new ValidationError("Invalid image format", errorsObj));
        }
    },
});

export default uploadInMemory;
