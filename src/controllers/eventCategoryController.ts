import { Request, Response } from "express";
import EventCategory from "../models/EventCategory";
import asyncWrapper from "../utils/asyncWrapper";

export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;

        const newCategory = new EventCategory({ name });
        await newCategory.save();

        res.status(201).json({ category: newCategory });
    } catch (err: any) {
        if (err.name === "MongoServerError" && (err.code === 11000 || err.code === 11001)
        ) {
            res.status(400).json({
                message: "Category name already exist",
            });
            return;
        }
        res.status(500).json({ message: "Server error", err });
    }
};

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await EventCategory.find();
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryId = req.params.id;

        const category = await EventCategory.findById(categoryId);

        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }

        res.status(200).json({ category });
    } catch (err: any) {
        if (err.kind === "ObjectId") {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        res.status(500).json({ message: "Server error", err });
    }
};

export const updateCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        const categoryId = req.params.id;

        const [findErr, category] = await asyncWrapper(EventCategory.findById(categoryId));

        if (findErr || !category) {
            res.status(400).json({ message: "Category not found" });
            return;
        }

        const [uniquenessErr, categoryWithSameName] = await asyncWrapper(EventCategory.findOne({
            name, _id: { $ne: categoryId },
        }));

        if (categoryWithSameName || uniquenessErr) {
            res.status(400).json({ message: "Category name already exists" });
            return;
        }

        const updatedCategory = await EventCategory.findByIdAndUpdate(
            categoryId,
            { name },
            { new: true, runValidators: true },
        );

        res.status(200).json(updatedCategory);
    } catch (err:any) {
        res.status(500).json({ message: "Server error", err });
    }
};

export const deleteCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const categoryId = req.params.id;

        const category = await EventCategory.findByIdAndDelete(categoryId);

        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err: any) {
        if (err.kind === "ObjectId") {
            res.status(404).json({ message: "Category not found" });
            return;
        }

        res.status(500).json({ message: "Server error", err });
    }
};
