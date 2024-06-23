import express from "express";
import {
    addDriver,
    deleteDriver,
    updateDriver,
    getDriverById,
    getAllDrivers
} from "../controllers/driverController";
import authenticateUser from "../middlewares/authenticateUser";
import isAdmin from "../middlewares/isAdmin";



const router = express.Router();

router.get("/", authenticateUser, isAdmin, getAllDrivers);
router.post("/", authenticateUser, isAdmin, addDriver);

router.get("/:id",authenticateUser, getDriverById);
router.put("/:id", authenticateUser, isAdmin, updateDriver);
router.delete("/:id", authenticateUser, isAdmin, deleteDriver);


export default router;
