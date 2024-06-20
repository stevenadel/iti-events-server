import { Router } from "express";
import {
    createCategory, deleteCategoryById, getAllCategories, getCategoryById, updateCategoryById,
} from "../controllers/eventCategoryController";
import validateEventCategoryReq from "../middlewares/validateEventCategoryReq";

const router = Router();

router.post("/", validateEventCategoryReq, createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", validateEventCategoryReq, updateCategoryById);
router.delete("/:id", deleteCategoryById);

export default router;
