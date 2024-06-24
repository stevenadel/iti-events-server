import { UserRole } from "../models/User";

export interface UserAttributes {
    firstName: string;
    lastName: string;
    birthdate: Date;
    email: string;
    password: string;
    isActive: boolean;
    role: UserRole;
}

export type UserToken = UserAttributes & { id: string };
