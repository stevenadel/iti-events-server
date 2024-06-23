import { Request, Response, NextFunction } from "express";
import uploadInMemory from "../configs/multer.config";
import ValidationError from "../errors/ValidationError";

const parseFormWithSingleImage = (fieldName: string) => (req: Request, res:Response, next: NextFunction) => {
    uploadInMemory.single(fieldName)(req, res, async (err) => {
        try {
            if (err && err.code === "LIMIT_FILE_SIZE") {
                next(new ValidationError("Image size exceeded 10MB limit", { [req.file?.fieldname || fieldName]: "Image size exceeded 10MB limit" }));
                return;
            }

            if (err) {
                next(err);
                return;
            }

            next();
        } catch (err) {
            next(err);
        }
    });
};

export default parseFormWithSingleImage;
