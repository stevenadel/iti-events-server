import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./users";
import eventCategoryRouter from "./eventCategory";
import driverRouter from "./drivers";
import eventRouter from "./events";
import busLineRouter from "./busLines";
import busPointRouter from "./busPoints";
import busUsers from "./busUsers";
import attendeeRouter from "./eventAttendees";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/event-categories", eventCategoryRouter);
router.use("/drivers", driverRouter);
router.use("/events", eventRouter);
router.use("/attendees", attendeeRouter);
router.use("/buses/lines", busLineRouter);
router.use("/buses/points", busPointRouter);
router.use("/buses/users", busUsers);

export default router;
