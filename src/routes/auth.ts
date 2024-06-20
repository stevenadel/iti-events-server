import { Router } from "express";
import { login, register, refresh } from "../controllers/authController";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/refresh", refresh);

export default router;
