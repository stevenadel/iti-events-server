import express from "express";
import { login, register, getUsers } from "../controllers/userController";

const router = express.Router();

router.get("/", getUsers);

router.post("/login", login);
router.post("/register", register);

export default router;
