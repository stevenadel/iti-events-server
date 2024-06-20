import Errors from "../types/Errors";
import AppError from "./AppError";

class ValidationError extends AppError {
    constructor(message = "Validation Error", errors: Errors = {}) {
        super(message, 400, errors);
    }
}

export default ValidationError;
