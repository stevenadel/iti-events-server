import Errors from "../types/Errors";

class AppError extends Error {
    status: number;
    errors: Errors;

    constructor(message: string, status = 500, errors: Errors = {}) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}

export default AppError;
