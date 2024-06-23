import { Router } from "express";
import authenticateUser from "../middlewares/authenticateUser";
import isAdmin from "../middlewares/isAdmin";
import { getAllUsers, getMe } from "../controllers/userController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

router.get("/", authenticateUser, isAdmin, getAllUsers);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current logged in user info
 *     tags: [Users]
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

export default router;
