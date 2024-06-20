import { Error } from "mongoose";
import AppError from "./AppError";
import Errors from "../types/Errors";

class DataValidationError extends AppError {
    constructor(error: Error.ValidationError, status = 422) {
        const errors: Errors = {};

        Object.keys(error.errors).forEach((field) => {
            this.errors[field] = error.errors[field].message;
        });

        super("Validation Error", status, errors);
    }
}

export default DataValidationError;
