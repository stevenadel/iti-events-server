import Errors from "../types/Errors";
import AppError from "./AppError";

class ValidationError extends AppError {
    constructor(message = "Validation Error", errors: Errors = {}) {
        super(message, 400, errors);
    }
}

export default ValidationError;

/**
 * @swagger
 * components:
 *   schemas:
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 'Validation failed'
 *         errors:
 *           type: object
 *           additionalProperties:
 *             type: string
 *             example: 'Field is required'
 *       example:
 *         message: 'Validation failed'
 *         errors:
 *           fieldName: 'Field is required'
 *           anotherField: 'Must be a valid email'
 */
