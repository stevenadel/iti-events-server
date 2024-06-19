import { DataTypes } from "sequelize";
import sequelize from "../config/database";

enum UserRole {
    Guest = "guest",
    Student = "student",
    Employee = "employee",
    Organization = "organization",
    Admin = "admin",
}

const nameValidation = {
    isAlpha: {
        msg: "Name can only contain letters"
    },
    notEmpty: {
        msg: "Name cannot be empty"
    },
    len: {
        args: [2, 20] as [number, number],
        msg: "Please enter a valid name"
    }
};

const User = sequelize.define("User", {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: nameValidation
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: nameValidation
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            name: "email",
            msg: "This email is already registered"
        },
        validate: {
            isEmail: {
                msg: "Invalid email format",
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 25],
                msg: "Password must be 8-25 characters long",
            },
        },
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    role: {
        type: DataTypes.ENUM(...Object.values(UserRole)),
        defaultValue: UserRole.Guest,
        validate: {
            isIn: {
                args: [Object.values(UserRole)],
                msg: 'Invalid role'
            }
        }
    }
});

export default User;
