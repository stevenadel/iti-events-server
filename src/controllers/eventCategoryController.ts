import { NextFunction, Request, Response } from "express";
import { UploadApiResponse } from "cloudinary";
import EventCategory from "../models/EventCategory";
import asyncWrapper from "../utils/asyncWrapper";
import ValidationError from "../errors/ValidationError";
import NotFoundError from "../errors/NotFoundError";
import isObjectIdValid from "../utils/mongoose";
import Event from "../models/Event";
import { deleteImageFromCloud, uploadImageToCloud } from "../utils/cloudinary";
import AppError from "../errors/AppError";

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name } = req.body;

    const [findErr, existingCategory] = await asyncWrapper(EventCategory.findOne({ name }));

    if (findErr) {
        next(new ValidationError("Another category with the same name exist"));
        return;
    }

    if (existingCategory) {
        next(new ValidationError("Category with same name exists", { name: "name already exists" }));
        return;
    }

    let imageUrl: string | null = null;
    let cloudinaryPublicId: string | null = null;

    if (req.file) {
        const [uploadErr, result] = await asyncWrapper<UploadApiResponse>(uploadImageToCloud(req.file?.buffer));
        if (uploadErr) {
            next(new AppError(`Couldn't upload image due to : ${uploadErr.message}`));
            return;
        }
        imageUrl = result.secure_url;
        cloudinaryPublicId = result.public_id;
    }
    const newCategory = new EventCategory({ name, imageUrl, cloudinaryPublicId });
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

    if (!req.file) {
        const [updateErr, updatedCategory] = await asyncWrapper(EventCategory.findByIdAndUpdate(
            categoryId,
            { name },
            { new: true, runValidators: true },
        ));

        if (updateErr) {
            next(updateErr);
            return;
        }

        res.status(200).json({ category: updatedCategory });
        return;
    }

    let imageUrl: string | null = null;
    let { cloudinaryPublicId } = category;

    await deleteImageFromCloud(cloudinaryPublicId || "");

    const [uploadErr, result] = await asyncWrapper<UploadApiResponse>(uploadImageToCloud(req.file?.buffer));
    if (uploadErr) {
        next(new AppError(`Couldn't upload image due to : ${uploadErr.message}`));
        return;
    }
    imageUrl = result.secure_url;
    cloudinaryPublicId = result.public_id;

    const [updateErr, updatedCategory] = await asyncWrapper(EventCategory.findByIdAndUpdate(
        categoryId,
        { name, imageUrl, cloudinaryPublicId },
        { new: true, runValidators: true },
    ));

    if (updateErr) {
        next(updateErr);
        return;
    }

    res.status(200).json({ category: updatedCategory });
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

    await deleteImageFromCloud(category?.cloudinaryPublicId || "");

    res.status(204).json({ message: "Category deleted successfully" });
};
