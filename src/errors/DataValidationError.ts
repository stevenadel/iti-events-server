import { ValidationError } from "sequelize";
import AppError from "./AppError";

interface ErrorItem {
    message: string;
}

class DataValidationError extends AppError {
    constructor(error: ValidationError) {
        const messages = error.errors.map((e: ErrorItem) => e.message).join(" - ");
        super(messages, 422);
    }
}

export default DataValidationError;
