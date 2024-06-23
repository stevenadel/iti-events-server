import express from "express";
import { subscribe, unsubscribe, getAllBusUsers } from "../controllers/busUsersController";

const router = express.Router();

router.post("/", subscribe);
router.delete("/", unsubscribe);
router.get("/:busLineId", getAllBusUsers);

export default router;
