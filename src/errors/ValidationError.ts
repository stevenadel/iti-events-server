import Errors from "../types/Errors";
import AppError from "./AppError";

class ValidationError extends AppError {
    constructor(errors: Errors = {}) {
        super("Validation Error", 400, errors);
    }
}

export default ValidationError;
