import { Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import { AuthenticatedRequest } from "../middlewares/authenticateUser";

const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new AppError("User not authenticated.", 401));
    }

    if (req.user.role !== "admin") {
        return next(new AppError("Access denied. Admins only.", 403));
    }

    next();
};

export default isAdmin;
