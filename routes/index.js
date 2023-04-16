const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const dashboardRouter = require("./dashboard");
const userRouter = require("./user");
const roleRouter = require("./role");
const productRouter = require("./product");
const customerRouter = require("./customer");
const eventRouter = require("./event");
const analysRouter = require("./analys");
const { verifyByCookies } = require("../middlewares/AuthHandler");

router.use("/auth", authRouter);
router.use("/", verifyByCookies, dashboardRouter);
router.use("/dashboard", verifyByCookies, dashboardRouter);
router.use("/users", verifyByCookies, userRouter);
router.use("/roles", verifyByCookies, roleRouter);
router.use("/products", verifyByCookies, productRouter);
router.use("/customers", verifyByCookies, customerRouter);
router.use("/events", verifyByCookies, eventRouter);
router.use("/analys", verifyByCookies, analysRouter);

module.exports = router;
