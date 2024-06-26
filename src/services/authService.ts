import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { UserAuth } from "../types/User";

dotenv.config();

export const {
    JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION,
} = process.env;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets are not defined in environment variables.");
}

function getTokenPayload(user: UserAuth) {
    return {
        id: user.id,
        role: user.role,
    };
}

export const generateAccessToken = (user: UserAuth) => jwt.sign(getTokenPayload(user), JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });

export const generateRefreshToken = (user: UserAuth) => jwt.sign(getTokenPayload(user), JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });
