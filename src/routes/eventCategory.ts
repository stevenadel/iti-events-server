import { Router } from "express";
import {
    createCategory, deleteCategoryById, getAllCategories, getCategoryById, updateCategoryById,
} from "../controllers/eventCategoryController";

const router = Router();

router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategoryById);
router.delete("/:id", deleteCategoryById);

export default router;
