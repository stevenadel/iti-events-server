import { Router } from "express";
import authenticateUser from "../middlewares/authenticateUser";
import isAdmin from "../middlewares/isAdmin";
import {
    getAllUsers, getMe, updateMe, getUser, createUser, createUsers, deleteUser, updateUser,
} from "../controllers/userController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticateUser, isAdmin, getAllUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticateUser, isAdmin, createUser);

/**
 * @swagger
 * /users/import:
 *   post:
 *     summary: Import users in bulk
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   description: The first name of the user
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   description: The last name of the user
 *                   example: Doe
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The email address of the user
 *                   example: john.doe@example.com
 *                 password:
 *                   type: string
 *                   description: The password of the user
 *                   minLength: 8
 *                   maxLength: 25
 *                   example: Passw0rd!
 *     responses:
 *       201:
 *         description: Users imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       207:
 *         description: Some users could not be imported
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Some users could not be imported.
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                         example: { firstName: "John", lastName: "Doe", email: "john.doe@example.com" }
 *                       error:
 *                         type: string
 *                         example: Password must be between 8 and 25 characters long.
 *                 createdUsers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request body format
 *       500:
 *         description: Internal server error
 */
router.post("/import", authenticateUser, isAdmin, createUsers);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current logged in user info
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged in user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/me", authenticateUser, getMe);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update current logged in user info
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user
 *                 pattern: '^[A-Za-z]+$'
 *                 minLength: 2
 *                 maxLength: 20
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: The last name of the user
 *                 pattern: '^[A-Za-z]+$'
 *                 minLength: 2
 *                 maxLength: 20
 *                 example: Doe
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 description: The birthdate of the user
 *                 example: 2000-01-01
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 minLength: 8
 *                 maxLength: 25
 *                 example: Passw0rd!
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.patch("/me", authenticateUser, updateMe);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authenticateUser, isAdmin, getUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id", authenticateUser, isAdmin, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticateUser, isAdmin, deleteUser);

export default router;
