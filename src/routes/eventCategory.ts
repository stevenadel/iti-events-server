import { Router } from "express";
import {
    createCategory, deleteCategoryById, getAllCategories, getCategoryById, updateCategoryById,
} from "../controllers/eventCategoryController";
import validateEventCategoryReq from "../middlewares/validateEventCategoryReq";

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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *                 example: "tech"
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
router.post("/", validateEventCategoryReq, createCategory);

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
 *               $ref: '#/components/schemas/NotFoundError'
 *       404:
 *         description: Category Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.get("/:id", getCategoryById);

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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *                 example: "tech"
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
router.put("/:id", validateEventCategoryReq, updateCategoryById);

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
