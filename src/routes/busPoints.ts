import express from "express";
import { addBusPoint, removeBusPoint, updateBusPoint, getAllBusPoints } from "../controllers/busPointController";
import authenticateUser from "../middlewares/authenticateUser";
import isAdmin from "../middlewares/isAdmin";

const router = express.Router();

router.get("/:busLineId", authenticateUser , getAllBusPoints);
router.post("/:busLineId", authenticateUser, isAdmin, addBusPoint);

router.put("/:busLineId/:busPointId", authenticateUser, isAdmin, updateBusPoint);
router.delete("/:busLineId/:busPointId", authenticateUser, isAdmin, removeBusPoint);


export default router;
