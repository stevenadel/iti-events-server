import { UserRole } from "../models/User";

export interface UserAttributes {
    firstName: string;
    lastName: string;
    birthdate: Date;
    email: string;
    emailVerified: boolean;
    password: string;
    isActive: boolean;
    role: UserRole;
}

export type UserAuth = UserAttributes & { id: string };
