import { DataTypes } from "sequelize";
import sequelize from "../config/database";

enum UserRole {
    Student = "student",
    Employee = "employee",
    Guest = "guest",
    Admin = "admin",
}

const User = sequelize.define("User", {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isAlpha: true,
            notEmpty: true,
            len: [2, 20],
        },
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isAlpha: true,
            notEmpty: true,
            len: [2, 20],
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: "Invalid email format.",
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 25],
                msg: "Password must be at least 8 characters long.",
            },
        },
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    role: {
        type: DataTypes.ENUM(UserRole.Student, UserRole.Employee, UserRole.Guest, UserRole.Admin),
        defaultValue: UserRole.Guest,
    },
});

export default User;
