import bcrypt from "bcrypt";
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import AppError from "../errors/AppError";
import { UserAttributes } from "../types/User";

const SALT_ROUNDS = 10;

export enum UserRole {
    Guest = "guest",
    Student = "student",
    Employee = "employee",
    Organization = "organization",
    Admin = "admin",
}

const nameValidation = {
    isAlpha: {
        msg: "Name can only contain letters",
    },
    notEmpty: {
        msg: "Name cannot be empty",
    },
    len: {
        args: [2, 20] as [number, number],
        msg: "Please enter a valid name",
    },
};

interface UserCreationAttributes extends Optional<UserAttributes, "isActive" | "role"> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare firstName: string;
    declare lastName: string;
    declare email: string;
    declare password: string;
    declare isActive: boolean;
    declare role: UserRole;

    public async generateHash(password: string): Promise<void> {
        try {
            const hash = await bcrypt.hash(password, SALT_ROUNDS);
            this.setDataValue("password", hash);
        } catch (error) {
            throw new AppError("Error saving password");
        }
    }

    public async validPassword(plainPassword: string): Promise<boolean> {
        try {
            const hash = this.getDataValue("password");
            return await bcrypt.compare(plainPassword, hash);
        } catch (error) {
            throw new AppError("Error validating password");
        }
    }
}

User.init(
    {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: nameValidation,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: nameValidation,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: "email",
                msg: "This email is already registered",
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
                    msg: "Invalid role",
                },
            },
        },
    },
    {
        sequelize,
        hooks: {
            beforeCreate: async (user) => {
                await user.generateHash(user.password);
            },
            beforeUpdate: async (user) => {
                if (user.changed("password")) {
                    await user.generateHash(user.password);
                }
            },
        },
    },
);

export default User;
