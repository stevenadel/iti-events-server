import bcrypt from "bcrypt";
import {
    Document, Schema, Model, UpdateQuery, model,
} from "mongoose";
import AppError from "../errors/AppError";
import asyncWrapper from "../utils/asyncWrapper";
import { UserAttributes } from "../types/User";

const SALT_ROUNDS = 10;

export enum UserRole {
    Guest = "guest",
    Student = "student",
    Employee = "employee",
    Admin = "admin",
}

interface UserDocument extends Document, UserAttributes {
    verifyPassword(plainPassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            match: [/^[A-Za-z]+$/, "Name can only contain letters"],
            trim: true,
            minlength: [2, "First name must be at least 2 characters long"],
            maxlength: [20, "First name must be at most 20 characters long"],
        },
        lastName: {
            type: String,
            required: [true, "Last name is required"],
            match: [/^[A-Za-z]+$/, "Name can only contain letters"],
            trim: true,
            minlength: [2, "Last name must be at least 2 characters long"],
            maxlength: [20, "Last name must be at most 20 characters long"],
        },
        birthdate: {
            type: Date,
            required: [true, "Birthdate is required"],
            validate: {
                validator(value: Date) {
                    return value <= new Date();
                },
                message: "Birthdate cannot be in the future",
            },
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            validate: {
                validator: (email: string) => /\S+@\S+\.\S+/.test(email),
                message: "Please enter a valid email",
            },
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: {
                values: Object.values(UserRole),
                message: "{VALUE} is not a valid role.",
            },
            default: UserRole.Guest,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.set("toJSON", {
    transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
    },
});

userSchema.methods.verifyPassword = async function (this: UserDocument, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.getAge = function (this: UserDocument): number {
    const birthdate = new Date(this.birthdate);
    const ageDiffMs = Date.now() - birthdate.getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

userSchema.pre<UserDocument>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const [error, hashedPassword] = await asyncWrapper(bcrypt.hash(this.password, SALT_ROUNDS));

    if (error || !hashedPassword) {
        return next(new AppError("Error saving password"));
    }

    this.password = hashedPassword;
    next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate() as UpdateQuery<UserDocument>;

    this.setOptions({ runValidators: true });

    if (!update.password) {
        return next();
    }

    const [error, hashedPassword] = await asyncWrapper(bcrypt.hash(update.password, SALT_ROUNDS));

    if (error || !hashedPassword) {
        return next(new AppError("Error saving password"));
    }

    update.password = hashedPassword;
    next();
});

const User: Model<UserDocument> = model<UserDocument>("User", userSchema);

export default User;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - birthdate
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *           example: John
 *           minLength: 2
 *           maxLength: 20
 *           pattern: "^[A-Za-z]+$"
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *           example: Doe
 *           minLength: 2
 *           maxLength: 20
 *           pattern: "^[A-Za-z]+$"
 *         birthdate:
 *           type: string
 *           format: date
 *           description: The birthdate of the user
 *           example: 2000-01-01
 *         email:
 *           type: string
 *           description: The email of the user
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           description: The password of the user
 *           example: Passw0rd!
 *           minLength: 8
 *           maxLength: 25
 *         isActive:
 *           type: boolean
 *           description: Whether the user is active
 *           example: true
 *         role:
 *           type: string
 *           description: The role of the user
 *           enum:
 *             - guest
 *             - student
 *             - employee
 *             - admin
 *           example: guest
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated
 *       example:
 *         id: 60d0fe4f5311236168a109ca
 *         firstName: John
 *         lastName: Doe
 *         birthdate: 2000-01-01
 *         email: john.doe@example.com
 *         role: guest
 *         createdAt: 2021-06-22T12:00:00Z
 *         updatedAt: 2021-06-22T12:00:00Z
 */
