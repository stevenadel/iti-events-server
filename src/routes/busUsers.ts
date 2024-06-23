import express from "express";
import { subscribe } from "../controllers/busUsersController";

const router = express.Router();

router.post("/", subscribe);

export default router;
