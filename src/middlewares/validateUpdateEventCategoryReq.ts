import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatValidationErrors } from "../utils/joiValidation";
import ValidationError from "../errors/ValidationError";

function validateUpdateEventCategoryReq(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        name: Joi.string().min(3).messages({
            "string.base": "Name should be a type of 'text'",
            "string.empty": "Name cannot be empty",
            "string.min": "Name should have a minimum length of {#limit}",
        }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        next(new ValidationError("Validation Error", formatValidationErrors(error)));
        return;
    }

    next();
}

export default validateUpdateEventCategoryReq;
