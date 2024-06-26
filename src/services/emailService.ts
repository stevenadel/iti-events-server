import crypto from "crypto";
import UserToken from "../models/UserToken";
import sendEmail from "../utils/sendEmail";
import asyncWrapper from "../utils/asyncWrapper";

const generateToken = () => crypto.randomBytes(32).toString("hex");

export const sendVerifyEmail = async (userId: string, email: string) => {
    const token = generateToken();

    const [tokenError, userToken] = await asyncWrapper(UserToken.create({ userId, token }));

    if (tokenError) {
        throw tokenError;
    }

    const verificationLink = `${process.env.BASE_URL}/auth/verify?token=${token}&id=${userId}`;

    const emailSubject = "ITI Email Verification";
    const emailText = `Welcome to ITI! Please verify your email by clicking on the following link: ${verificationLink}`;

    try {
        await sendEmail(email, emailSubject, emailText);
    } catch (sendError) {
        if (userToken) {
            await UserToken.deleteOne({ userId: userToken.userId, token: userToken.token });
        }
        throw sendError;
    }

    console.log("Verification email sent successfully");
};

export const sendResetPasswordEmail = async (userId: string, email: string) => {
    const token = generateToken();

    const [tokenError, userToken] = await asyncWrapper(UserToken.create({ userId, token }));

    if (tokenError) {
        throw tokenError;
    }

    const resetPasswordLink = `${process.env.BASE_URL}/auth/reset?token=${token}&id=${userId}`;

    const emailSubject = "ITI Password Reset";
    const emailText = `You requested a password reset. Please reset your password by clicking on the following link: ${resetPasswordLink}`;

    try {
        await sendEmail(email, emailSubject, emailText);
    } catch (sendError) {
        if (userToken) {
            await UserToken.deleteOne({ userId: userToken.userId, token: userToken.token });
        }
        throw sendError;
    }

    console.log("Password reset email sent successfully");
};
