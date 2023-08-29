const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const dashboardRouter = require("./dashboard");
const userRouter = require("./user");
const roleRouter = require("./role");
const productRouter = require("./product");
const categoryRouter = require("./category");
const customerRouter = require("./customer");
const eventRouter = require("./event");
const taskRouter = require("./task");
const productEventRouter = require("./productEvent");
const analysRouter = require("./analys");
const { verifyByCookies } = require("../middlewares/AuthHandler");

router.use("/", dashboardRouter);
router.use("/auth", authRouter);
router.use("/users", verifyByCookies, userRouter);
router.use("/roles", verifyByCookies, roleRouter);
router.use("/products", verifyByCookies, productRouter);
router.use("/categories", verifyByCookies, categoryRouter);
router.use("/customers", verifyByCookies, customerRouter);
router.use("/events", verifyByCookies, eventRouter);
router.use("/tasks", verifyByCookies, taskRouter);
router.use("/productevent", verifyByCookies, productEventRouter);
router.use("/analys", verifyByCookies, analysRouter);

module.exports = router;
