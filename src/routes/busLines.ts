import express from "express";
import { createBusLine, getBusLines, getBusLineById, updateBusLine, deleteBusLine } from "../controllers/busLineController";

const router = express.Router();

router.get("/", getBusLines);
router.post("/", createBusLine);

router.get("/:id", getBusLineById);
router.put("/:id", updateBusLine);
router.delete("/:id", deleteBusLine);


export default router;
