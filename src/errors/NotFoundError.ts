import AppError from "./AppError";

class NotFoundError extends AppError {
    constructor(message = "Not Found") {
        super(message, 404, {});
    }
}

export default NotFoundError;

/**
 * @swagger
 * components:
 *   schemas:
 *     NotFoundError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: 'Not Found Error'
 *         errors:
 *           type: object
 *           additionalProperties:
 *             type: string
 *             example: 'Field is required'
 *       example:
 *         message: 'Not Found Error'
 *         errors:
 *           fieldName: 'Field is required'
 *           anotherField: 'Must be a valid email'
 */
