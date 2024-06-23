import { NextFunction, Request, Response } from "express";
import EventCategory from "../models/EventCategory";
import asyncWrapper from "../utils/asyncWrapper";
import ValidationError from "../errors/ValidationError";
import NotFoundError from "../errors/NotFoundError";
import isObjectIdValid from "../utils/mongoose";
import Event from "../models/Event";

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name } = req.body;

    const [findErr, _] = await asyncWrapper(EventCategory.findOne({ name }));

    if (findErr) {
        next(new ValidationError("Another category with the same name exist"));
        return;
    }

    const newCategory = new EventCategory({ name });
    const [createErr] = await asyncWrapper(newCategory.save());

    if (createErr) {
        next(createErr);
        return;
    }

    res.status(201).json({ category: newCategory });
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const [err, categories] = await asyncWrapper(EventCategory.find());
    if (err) {
        next(err);
        return;
    }

    res.json({ categories });
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const categoryId = req.params.id;
    if (!isObjectIdValid(categoryId)) {
        next(new ValidationError("Invalid id format"));
        return;
    }

    const [err, category] = await asyncWrapper(EventCategory.findById(categoryId));

    if (err) {
        next(err);
        return;
    }

    if (!category) {
        next(new NotFoundError(`Category with id [${categoryId}] doesn't exist`));
        return;
    }

    res.json({ category });
};

export const getCategoryEvents = async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.id;
    if (!isObjectIdValid(categoryId)) {
        next(new ValidationError("Invalid id format"));
        return;
    }

    const [err, events] = await asyncWrapper(Event.find({ category: categoryId }));

    if (err) {
        next(err);
        return;
    }

    res.json({ events });
};

export const updateCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name } = req.body;
    const categoryId = req.params.id;

    if (!isObjectIdValid(categoryId)) {
        next(new ValidationError("Invalid id format"));
        return;
    }

    const [findErr, category] = await asyncWrapper(EventCategory.findById(categoryId));

    if (findErr) {
        next(findErr);
        return;
    }

    if (!category) {
        next(new NotFoundError(`Category with id [${categoryId}] doesn't exist`));
        return;
    }

    const [uniquenessErr, categoryWithSameName] = await asyncWrapper(EventCategory.findOne({
        name, _id: { $ne: categoryId },
    }));

    if (uniquenessErr) {
        next(uniquenessErr);
        return;
    }

    if (categoryWithSameName) {
        next(new ValidationError("Category name already exists"));
        return;
    }

    const [updateErr, updatedCategory] = await asyncWrapper(EventCategory.findByIdAndUpdate(
        categoryId,
        { name },
        { new: true, runValidators: true },
    ));

    if (updateErr) {
        next(updateErr);
        return;
    }

    res.status(201).json({ category: updatedCategory });
};

export const deleteCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const categoryId = req.params.id;

    if (!isObjectIdValid(categoryId)) {
        next(new ValidationError("Invalid id format"));
        return;
    }

    const [err, category] = await asyncWrapper(EventCategory.findByIdAndDelete(categoryId));

    if (err) {
        next(err);
        return;
    }

    if (!category) {
        next(new NotFoundError(`Category with id [${categoryId}] doesn't exists`));
        return;
    }

    res.status(204).json({ message: "Category deleted successfully" });
};
