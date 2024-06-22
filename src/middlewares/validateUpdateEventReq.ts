import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { formatValidationErrors } from "../utils/joiValidation";
import ValidationError from "../errors/ValidationError";

function validateUpdateEventReq(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .messages({
                "string.base": "Name should be a type of 'text'",
                "string.empty": "Name cannot be empty",
                "string.min": "Name should have a minimum length of {#limit}",
                "any.required": "Name is a required",
            }),
        description: Joi.string()
            .min(3)
            .messages({
                "string.base": "description should be a type of 'text'",
                "string.empty": "description cannot be empty",
                "string.min": "description should have a minimum length of {#limit}",
                "any.required": "description is a required",
            }),
        category: Joi.string()
            .messages({
                "string.base": "category should be a type of 'text'",
                "string.empty": "category cannot be empty",
                "any.required": "category is a required",
            }),
        startDate: Joi.date()
            .min("now")
            .iso()
            .messages({
                "date.base": "Start Date should be a valid date",
                "date.min": "Start Date can't be less than now",
                "date.format": "Start date should should be ISO 8601 format YYYY-MM-DD / YYYY-MM-DDT00:00:00",
                "any.required": "Start Date is required",
            }),
        capacity: Joi.number()
            .integer()
            .positive()
            .strict()
            .messages({
                "number.base": "Capacity should be a number",
                "number.positive": "Capacity must be a positive number",
                "number.integer": "Capacity must be an integer",
                "any.required": "Capacity is required",
            }),

        price: Joi.number()
            .positive()
            .precision(2)
            .strict()
            .messages({
                "number.base": "price should be a number",
                "number.positive": "price must be a positive number",
                "number.precision": "price must have no more than 2 decimal places",
            }),
        duration: Joi.number()
            .integer()
            .positive()
            .strict()
            .messages({
                "number.base": "duration should be a number",
                "number.positive": "duration must be a positive number",
                "number.integer": "duration must be an integer",
            }),
        registrationClose: Joi.boolean()
            .strict()
            .messages({
                "boolean.base": "registrationClosed must be true/false",
            }),
        isActive: Joi.boolean()
            .strict()
            .messages({
                "boolean.base": "isActive must be true/false",
            }),
        isPaid: Joi.boolean()
            .strict()
            .messages({
                "boolean.base": "isPaid must be true/false",
            }),
        minAge: Joi.number()
            .integer()
            .positive()
            .strict()
            .messages({
                "number.base": "minAge should be a number",
                "number.positive": "minAge must be a positive number",
                "number.integer": "minAge must be an integer",
            }),
        maxAge: Joi.number()
            .integer()
            .positive()
            .greater(Joi.ref("minAge"))
            .strict()
            .messages({
                "number.base": "maxAge should be a number",
                "number.positive": "maxAge must be a positive number",
                "number.integer": "maxAge must be an integer",
                "number.greater": "maxAge must be greater than minAge",
            }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        next(new ValidationError("Validation Error", formatValidationErrors(error)));
        return;
    }

    next();
}

export default validateUpdateEventReq;
