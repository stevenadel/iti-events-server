import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import Errors from "../types/Errors";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let status = 500;
    let message = "Internal Server Error";
    let errors: Errors | undefined;

    if (err instanceof AppError) {
        status = err.status;
        message = err.message;
        errors = err.errors;
    }

    // For debugging, remove in production
    console.error(err.stack);

    res.status(status).json({
        message,
        errors,
    });
};

export default errorHandler;
