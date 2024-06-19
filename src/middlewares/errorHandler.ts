import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let status = 500;
    let message = "Internal Server Error";

    if (err instanceof AppError) {
        status = (err as AppError).status;
        message = err.message;
    }

    // for debugging, remove in production
    console.error(err.stack);

    res.status(status).json({
        message,
    });
};

export default errorHandler;
