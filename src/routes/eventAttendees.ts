import { Router } from "express";
import authenticateUser from "../middlewares/authenticateUser";
import isAdmin from "../middlewares/isAdmin";
import { allAttendees } from "../controllers/attendeeController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Event Attendees
 *   description: Event attendees management
 */

/**
 * @swagger
 * /attendees:
 *   get:
 *     summary: Get all the attendess of all events [ADMINS ONLY]
 *     tags: [Event Attendees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User registration cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attendees:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EventAttendeePopulated'
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticateUser, isAdmin, allAttendees);

export default router;
