import express from "express";
import { addBusPoint, removeBusPoint, updateBusPoint, getAllBusPoints } from "../controllers/busPointController";

const router = express.Router();

router.get("/:busLineId", getAllBusPoints);
router.post("/:busLineId", addBusPoint);

router.put("/:busLineId/:busPointId", updateBusPoint);
router.delete("/:busLineId/:busPointId", removeBusPoint);


export default router;
