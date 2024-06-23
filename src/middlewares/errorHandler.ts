import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import Errors from "../types/Errors";
import deleteFromCloudinary from "../utils/cloudinary";
import asyncWrapper from "../utils/asyncWrapper";

const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (req.body.cloudinaryPublicId) {
        const [deleteErr, result] = await asyncWrapper(deleteFromCloudinary(req.body.cloudinaryPublicId));
        if (deleteErr) {
            console.log(`Couldn't delete image from cloudinary with url [${req.body.imageUrl}]`);
        }
        if (result) {
            console.log(`Successfully delete image from cloudinary with url [${req.body.imageUrl}]`);
        }
    }

    let status = 500;
    let message = "Internal Server Error";
    let errors: Errors | undefined;

    if (err instanceof AppError) {
        status = err.status;
        message = err.message;
        errors = err.errors;
    }

    // log joi errors
    // log multer errors
    // log cloudinary errors
    // log any other errors
    // For debugging, remove in production
    console.error(err.stack);

    res.status(status).json({
        message,
        errors,
    });
};

export default errorHandler;
