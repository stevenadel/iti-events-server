import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import asyncWrapper from "../utils/asyncWrapper";
import User, { UserRole } from "../models/User";
import AppError from "../errors/AppError";
import DataValidationError from "../errors/DataValidationError";
import NotFoundError from "../errors/NotFoundError";
import { AuthenticatedRequest } from "../middlewares/authenticateUser";

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    const [error, users] = await asyncWrapper(User.find());

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    res.json(users);
}

export async function getMe(req: AuthenticatedRequest, res:Response, next: NextFunction) {
    res.json({ user: req.user });
}

export async function updateMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const userId = req.user.id;
    const updateData = req.body;
    delete updateData.emailVerified;

    if (req.user.role !== UserRole.Admin) {
        delete updateData.isActive;
        delete updateData.role;
    }

    if (updateData.password) {
        if (updateData.password.length < 8 || updateData.password.length > 25) {
            return next(new AppError("Password must be between 8 and 25 characters long.", 422));
        }
    }

    const [error, updatedUser] = await asyncWrapper(
        User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }),
    );

    if (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const requiredError = Object.values(error.errors).find((err) => err.kind === "required");

            if (requiredError) {
                return next(new DataValidationError(error, 400));
            }

            return next(new DataValidationError(error));
        }

        if ((error as any).code === 11000) {
            return next(new AppError("Email already exists. Please use a different email.", 409));
        }

        return next(new AppError("Database error. Please try again later."));
    }

    if (!updatedUser) {
        return next(new NotFoundError("User not found."));
    }

    res.json(updatedUser);
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid user ID format.", 400));
    }

    const [error, user] = await asyncWrapper(User.findById(id));

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    if (!user) {
        return next(new NotFoundError("User not found."));
    }

    res.json(user);
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
    const userData = req.body;

    if (userData.password.length < 8 || userData.password.length > 25) {
        return next(new AppError("Password must be between 8 and 25 characters long.", 422));
    }

    const [error, newUser] = await asyncWrapper(User.create(userData));

    if (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const requiredError = Object.values(error.errors).find((err) => err.kind === "required");

            if (requiredError) {
                return next(new DataValidationError(error, 400));
            }

            return next(new DataValidationError(error));
        }

        if ((error as any).code === 11000) {
            return next(new AppError("Email already exists. Please use a different email.", 409));
        }

        return next(new AppError("Database error. Please try again later."));
    }

    res.status(201).json(newUser);
}

export async function createUsers(req: Request, res: Response, next: NextFunction) {
    const usersData = req.body;

    const results: string[] = [];
    const errors: any[] = [];

    if (!Array.isArray(usersData)) {
        next(new AppError("Must provide users in an array.", 400));
    }

    const createUserPromises = usersData.map(async (userData: { password: string; }) => {
        if (!userData.password || userData.password.length < 8 || userData.password.length > 25) {
            errors.push({ user: userData, error: "Password must be between 8 and 25 characters long." });
            return;
        }

        try {
            const newUser: any = await User.create(userData);
            results.push(newUser);
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) {
                const requiredError = Object.values(error.errors).find((err) => err.kind === "required");

                if (requiredError) {
                    errors.push({ user: userData, error: "Missing required fields." });
                } else {
                    errors.push({ user: userData, error: "Data validation error." });
                }
            } else if ((error as any).code === 11000) {
                errors.push({ user: userData, error: "Email already exists. Please use a different email." });
            } else {
                errors.push({ user: userData, error: "Database error. Please try again later." });
            }

            console.error(`Error creating user: ${JSON.stringify(userData)}, Error: ${error}`);
        }
    });

    await Promise.all(createUserPromises);

    if (errors.length) {
        res.status(207).json({
            message: "Some users could not be created.",
            errors,
            createdUsers: results,
        });
    } else {
        res.status(201).json(results);
    }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid user ID format.", 400));
    }

    if (updateData.password) {
        if (updateData.password.length < 8 || updateData.password.length > 25) {
            return next(new AppError("Password must be between 8 and 25 characters long.", 422));
        }
    }

    const [error, updatedUser] = await asyncWrapper(
        User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }),
    );

    if (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const requiredError = Object.values(error.errors).find((err) => err.kind === "required");

            if (requiredError) {
                return next(new DataValidationError(error, 400));
            }

            return next(new DataValidationError(error));
        }

        if ((error as any).code === 11000) {
            return next(new AppError("Email already exists. Please use a different email.", 409));
        }

        return next(new AppError("Database error. Please try again later."));
    }

    if (!updatedUser) {
        return next(new NotFoundError("User not found."));
    }

    res.json(updatedUser);
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError("Invalid user ID format.", 400));
    }

    const [error, deletedUser] = await asyncWrapper(User.findByIdAndDelete(id));

    if (error) {
        return next(new AppError("Database error. Please try again later."));
    }

    if (!deletedUser) {
        return next(new NotFoundError("User not found."));
    }

    res.status(204).send();
}
