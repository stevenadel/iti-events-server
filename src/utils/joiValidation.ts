import Joi from "joi";

export const formatValidationErrors = (error: Joi.ValidationError) => error.details.reduce((acc: { [key: string]: string }, currentError) => {
    acc[currentError.context?.key || ""] = currentError.message;
    return acc;
}, {});
