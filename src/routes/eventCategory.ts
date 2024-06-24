import { Router } from "express";
import {
    createCategory, deleteCategoryById, getAllCategories, getCategoryById, getCategoryEvents, updateCategoryById,
} from "../controllers/eventCategoryController";
import validateCreateEventCategoryReq from "../middlewares/validateCreateEventCategoryReq";
import parseFormWithSingleImage from "../middlewares/parseFormWithSingleImage";
import validateUpdateEventCategoryReq from "../middlewares/validateUpdateEventCategoryReq";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: EventCategories
 *   description: Event category management
 */

/**
 * @swagger
 * /event-categories:
 *   post:
 *     summary: Create new event category
 *     tags: [EventCategories]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: An optional image for the category (max size 10MB)
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   $ref: '#/components/schemas/EventCategory'
 *       400:
 *         description: Invalid body request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */

router.post("/", parseFormWithSingleImage(), validateCreateEventCategoryReq, createCategory);

/**
 * @swagger
 * /event-categories:
 *   get:
 *     summary: Get all event categories
 *     tags: [EventCategories]
 *     responses:
 *       200:
 *         description: List of all event categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EventCategory'
 */
router.get("/", getAllCategories);

/**
 * @swagger
 * /event-categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [EventCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: The category description by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   $ref: '#/components/schemas/EventCategory'
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
router.get("/:id", getCategoryById);

/**
 * @swagger
 * /event-categories/{id}/events:
 *   get:
 *     summary: Get all category events
 *     tags: [EventCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: The category description by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
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
router.get("/:id/events", getCategoryEvents);

/**
 * @swagger
 * /event-categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [EventCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: An optional image for the category (max size 10MB)
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   $ref: '#/components/schemas/EventCategory'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
router.put("/:id", parseFormWithSingleImage(), validateUpdateEventCategoryReq, updateCategoryById);

/**
 * @swagger
 * /event-categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [EventCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
router.delete("/:id", deleteCategoryById);

export default router;
