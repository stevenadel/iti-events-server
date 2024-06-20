import { Router } from "express";
import userRouter from "./users";
import eventCategoryRouter from "./eventCategory";
// import driverRouter from "./drivers";
// import eventRouter from "./events";
// import busLineRouter from "./busLines";
// import busPointRouter from "./busPoints";

const router = Router();

router.use("/users", userRouter);
router.use("/event-categories", eventCategoryRouter);
// router.use("/drivers", driverRouter);
// router.use("/events", eventRouter);
// router.use("/buses/lines", busLineRouter);
// router.use("/buses/points", busPointRouter);

export default router;
