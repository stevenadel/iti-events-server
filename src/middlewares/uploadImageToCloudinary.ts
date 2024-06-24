import { Request, Response, NextFunction } from "express";
import cloudinary from "../configs/cloudinaryConfig";

const uploadSingleImageToCloud = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            next();
            return;
        }
        const stream = cloudinary.uploader.upload_stream({ folder: "uploads" }, (err, result) => {
            if (err) {
                next(err);
                return;
            }

            if (!result) {
                next(new Error("Cloudinary upload failed with result undefined"));
                return;
            }

            req.body.imageUrl = result.secure_url;
            console.log(`Uploaded image with url [${req.body.imageUrl}]`);
            req.body.imagePublicId = result.public_id;
            next();
        });
        stream.end(req.file?.buffer);
    } catch (err) {
        next(err);
    }
};

export default uploadSingleImageToCloud;
