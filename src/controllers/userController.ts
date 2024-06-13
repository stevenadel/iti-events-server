import { Request, Response } from "express";
import User from "../models/User";

export async function login(req: Request, res: Response) {
    res.json({
        loggedIn: "test",
    });
}

export async function register(req: Request, res: Response) {
    try {
        // dummy data placeholder
        const userData = {
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            password: "password123",
            isActive: true,
            role: "student",
        };

        const newUser = await User.create(userData);

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json(error);
    }
}

export async function getUsers(req: Request, res: Response) {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json(error);
    }
}
