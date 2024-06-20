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
    Organization = "organization",
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
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
            maxlength: [25, "Password must be at most 25 characters long"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
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
        delete ret.isActive;
    },
});

userSchema.methods.verifyPassword = async function (this: UserDocument, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
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
