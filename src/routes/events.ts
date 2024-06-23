import Router from "express";
import {
    createEvent, deleteEvent, getAllEvents, getCurrentEvents, getEventById, getFinishedEvents,
    updateEvent,
} from "../controllers/eventController";
import validateCreateEventReq from "../middlewares/validateCreateEventReq";
import validateUpdateEventReq from "../middlewares/validateUpdateEventReq";

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

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of All events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EventPopulated'
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllEvents);

/**
 * @swagger
 * /events/current:
 *   get:
 *     summary: Get all current events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of current events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EventPopulated'
 *       500:
 *         description: Internal server error
 */
router.get("/current", getCurrentEvents);

/**
 * @swagger
 * /events/finished:
 *   get:
 *     summary: Get all finished events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of finished events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EventPopulated'
 *       500:
 *         description: Internal server error
 */
router.get("/finished", getFinishedEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Return Event found in DB
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   $ref: '#/components/schemas/EventPopulated'
 *       400:
 *         description: Invalid Id Format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               message: "Invalid event id format"
 *               errors: {}
 *       404:
 *         description: Event Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             example:
 *               message: "Event not found"
 *               errors: {}
 */
router.get("/:id", getEventById);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an existing event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               registrationClosed:
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
 *                 description: The auto-generated id of the category
 *     responses:
 *       200:
 *         description: Updated event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   $ref: '#/components/schemas/EventPopulated'
 *       400:
 *         description: Invalid Id Format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               message: "Invalid event id format"
 *               errors: {}
 *       404:
 *         description: Event Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             example:
 *               message: "Event not found"
 *               errors: {}
 *       500:
 *         description: Internal server error
 */

router.put("/:id", validateUpdateEventReq, updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an existing event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       204:
 *         description: Event successfully deleted
 *       400:
 *         description: Invalid Id Format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               message: "Invalid event id format"
 *               errors: {}
 *       404:
 *         description: Event Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             example:
 *               message: "Event not found"
 *               errors: {}
 *       500:
 *         description: Internal server error
 */

router.delete("/:id", deleteEvent);

export default router;
