import express from "express";
import { addBusPoint, removeBusPoint, updateBusPoint, getAllBusPoints } from "../controllers/busPointController";

const router = express.Router();

router.get("/", getAllBusPoints);
router.post("/", addBusPoint);

router.put("/:id", updateBusPoint);
router.delete("/:id", removeBusPoint);


export default router;
