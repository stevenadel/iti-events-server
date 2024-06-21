import Router from "express";
import { createEvent } from "../controllers/eventController";
import validateCreateEventReq from "../middlewares/validateCreateEventReq";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     description: Create a new event and return the created event object.
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - startDate
 *               - capacity
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the event
 *               description:
 *                 type: string
 *                 description: A short description of the event
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: The start date and time of the event
 *               capacity:
 *                 type: integer
 *                 description: The maximum number of attendees for the event
 *               price:
 *                 type: number
 *                 description: The price of the event
 *               duration:
 *                 type: integer
 *                 description: The duration of the event in hours
 *               registrationClose:
 *                 type: boolean
 *                 description: Indicates if registration for the event is closed
 *               isActive:
 *                 type: boolean
 *                 description: Indicates if the event is active
 *               isPaid:
 *                 type: boolean
 *                 description: Indicates if the event is a paid event
 *               minAge:
 *                 type: integer
 *                 description: The minimum age requirement for attendees
 *               maxAge:
 *                 type: integer
 *                 description: The maximum age limit for attendees
 *               category:
 *                 type: string
 *                 description: The ID of the category to which the event belongs
 *                 example: 60c72b2f9b1e8e3a3c8f9e4b
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post("/", validateCreateEventReq, createEvent);

export default router;
