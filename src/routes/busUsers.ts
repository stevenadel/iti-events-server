import express from "express";
import { subscribe, unsubscribe, getAllBusUsers } from "../controllers/busUsersController";
import authenticateUser from "../middlewares/authenticateUser";

const router = express.Router();

router.post("/", authenticateUser, subscribe);
router.delete("/", authenticateUser, unsubscribe);
router.get("/:busLineId", authenticateUser, getAllBusUsers);

export default router;
