import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatValidationErrors } from "../utils/joiValidation";
import ValidationError from "../errors/ValidationError";

function validateCreateEventCategoryReq(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        name: Joi.string().min(3).required().messages({
            "string.base": "Name should be a type of 'text'",
            "string.empty": "Name cannot be empty",
            "string.min": "Name should have a minimum length of {#limit}",
            "any.required": "Name is a required",
        }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        next(new ValidationError("Validation Error", formatValidationErrors(error)));
        return;
    }

    next();
}

export default validateCreateEventCategoryReq;
