import { Router } from "express";
import {
    login, loginMobile, register, refresh, verify, forgotPassword, resetPassword,
} from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: Passw0rd!
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The access token
 *                   example: "some-jwt-token"
 *                 refreshToken:
 *                   type: string
 *                   description: The refresh token
 *                   example: "some-refresh-token"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/login/mobile:
 *   post:
 *     summary: Login a user via mobile
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: Passw0rd!
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The access token
 *                   example: "some-jwt-token"
 *                 refreshToken:
 *                   type: string
 *                   description: The refresh token
 *                   example: "some-refresh-token"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Forbidden - User must have an active event with a valid end date
 */
router.post("/login/mobile", loginMobile);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
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
 *                 description: The user's birthdate
 *                 format: date
 *                 example: 1990-01-01
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
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                   description: The access token for the user
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   description: The refresh token for the user
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *                 example: "some-refresh-token"
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token
 *                   example: "some-new-jwt-token"
 *       400:
 *         description: Validation error
 *       403:
 *         description: Invalid refresh token
 *       404:
 *         description: User not found
 */
router.post("/refresh", refresh);

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verify user's email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The verification token
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Verification success message
 *                   example: Email verified successfully
 *       400:
 *         description: Validation error or invalid token
 *       404:
 *         description: User not found
 */
router.get("/verify", verify);

/**
 * @swagger
 * /auth/forgot:
 *   post:
 *     summary: Initiate password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address to send the reset link to
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Validation error or invalid email
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/forgot", forgotPassword);

/**
 * @swagger
 * /auth/reset:
 *   post:
 *     summary: Reset user password with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The token received in the password reset email
 *               id:
 *                 type: string
 *                 description: The user's ID
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 25
 *                 description: The new password
 *                 example: NewPassw0rd!
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Password reset success message
 *                   example: Password reset successfully
 *       400:
 *         description: Validation error or invalid token
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/reset", resetPassword);

export default router;
