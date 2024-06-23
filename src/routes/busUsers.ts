import express from "express";
import { subscribe, unsubscribe } from "../controllers/busUsersController";

const router = express.Router();

router.post("/", subscribe);
router.delete("/", unsubscribe);

export default router;
