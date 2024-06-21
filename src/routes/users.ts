import { Router } from "express";
import authenticateUser from "../middlewares/authenticateUser";
import { getAllUsers } from "../controllers/userController";

const router = Router();

router.get("/", authenticateUser, getAllUsers);

export default router;
