import express from "express";
import { addDriver,
    deleteDriver,
    updateDriver,
    getDriverById,
    getAllDrivers } from "../controllers/driverController";

const router = express.Router();

router.get("/", getAllDrivers);
router.post("/", addDriver);

router.get("/:id", getDriverById);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);


export default router;
