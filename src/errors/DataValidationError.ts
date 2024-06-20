import { ValidationError } from "sequelize";
import AppError from "./AppError";

interface ErrorItem {
    message: string;
}

class DataValidationError extends AppError {
    constructor(error: ValidationError, status = 422) {
        const messages = error.errors.map((e: ErrorItem) => e.message).join(" - ");
        super(messages, status);
    }
}

export default DataValidationError;
