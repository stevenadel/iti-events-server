import express from "express";
import userRouter from "./users";
// import driverRouter from "./drivers";
// import eventRouter from "./events";
// import busLineRouter from "./busLines";
// import busPointRouter from "./busPoints";

const router = express.Router();

router.use("/users", userRouter);
// router.use("/drivers", driverRouter);
// router.use("/events", eventRouter);
// router.use("/buses/lines", busLineRouter);
// router.use("/buses/points", busPointRouter);

export default router;
