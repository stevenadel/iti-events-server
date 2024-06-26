import express from "express";
import { createBusLine, getBusLines, getBusLineById, updateBusLine, deleteBusLine} from "../controllers/busLineController";
import authenticateUser from "../middlewares/authenticateUser";
import isAdmin from "../middlewares/isAdmin";
import parseFormWithSingleImage from "../middlewares/parseFormWithSingleImage";

const router = express.Router();

router.get("/",authenticateUser, getBusLines);
router.post("/", authenticateUser, isAdmin, parseFormWithSingleImage(),  createBusLine);

router.get("/:id",authenticateUser,  getBusLineById);
router.put("/:id", authenticateUser, isAdmin,  updateBusLine);
router.delete("/:id", authenticateUser, isAdmin, deleteBusLine);


export default router;
