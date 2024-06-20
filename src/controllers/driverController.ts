import { NextFunction, Request, Response } from "express";
import Driver from "../models/Driver";
import asyncWrapper from "../utils/asyncWrapper";
import AppError from "../errors/AppError";

export async function addDriver(req: Request, res: Response, next: NextFunction) {
  const { name, phone_number } = req.body;
  const driverData = { name, phone_number };

  const [error, driver] = await asyncWrapper(Driver.create(driverData));

  if (error) {
    return next(new AppError("Failed to create driver."));
  }

  res.status(201).json(driver);
};

export async function deleteDriver(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  const [error, deletedDriver] = await asyncWrapper(Driver.findByIdAndDelete(id));

  if (error) {
    return next(new AppError("Failed to delete driver."));
  }

  if (!deletedDriver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  res.json({ message: 'Driver deleted successfully', driver: deletedDriver });
};


export async function updateDriver(req: Request, res: Response, next: NextFunction){
  const id = req.params.id;
  const { name, phone_number } = req.body;
  const updatedData = { name, phone_number };

  const [error, updatedDriver] = await asyncWrapper(Driver.findByIdAndUpdate(id, updatedData, { new: true }));

  if (error) {
    return next(new Error("Failed to update driver."));
  }

  if (!updatedDriver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  res.json(updatedDriver);
};


export async function getDriverById (req: Request, res: Response, next: NextFunction){
  const id = req.params.id;

  const [error, driver] = await asyncWrapper(Driver.findById(id));

  if (error) {
    return next(new Error("Failed to retrieve driver."));
  }

  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  res.json(driver);
};


export async function getAllDrivers(req: Request, res: Response, next: NextFunction){
  const [error, drivers] = await asyncWrapper(Driver.find());

  if (error) {
    return next(new AppError("Failed to retrieve drivers."));
  }

  res.json(drivers);
};