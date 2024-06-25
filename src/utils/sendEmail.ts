import nodemailer from "nodemailer";
import asyncWrapper from "../utils/asyncWrapper";
import AppError from "../errors/AppError";

const sendEmail = async (email: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        service: process.env.EMAIL_SERVICE,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const [error, info] = await asyncWrapper(
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            text,
        }),
    );

    if (error) {
        console.log("Email not sent:", error);
        throw new AppError("Failed to send email verification.");
    }

    console.log("Email sent successfully:", info);
};

export default sendEmail;
