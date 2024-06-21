import { Router } from "express";
import authenticateUser from "../middlewares/authenticateUser";
import isAdmin from "../middlewares/isAdmin";
import { getAllUsers } from "../controllers/userController";

const router = Router();

router.get("/", authenticateUser, isAdmin, getAllUsers);

export default router;
