import { Error } from "mongoose";
import AppError from "./AppError";

class DataValidationError extends AppError {
    errors: { [field: string]: string };

    constructor(error: Error.ValidationError, status = 422) {
        super("Validation Error", status);

        this.errors = {};

        Object.keys(error.errors).forEach((field) => {
            this.errors[field] = error.errors[field].message;
        });
    }
}

export default DataValidationError;
