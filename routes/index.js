const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const userRouter = require("./user");
const roleRouter = require("./role");
const productRouter = require("./product");
const customerRouter = require("./customer");
const dashboardRouter = require("./dashboard");
const { verifyByCookies } = require("../middlewares/AuthHandler");

router.use("/auth", authRouter);
router.use("/", verifyByCookies, dashboardRouter);
router.use("/dashboard", verifyByCookies, dashboardRouter);
router.use("/users", verifyByCookies, userRouter);
router.use("/roles", verifyByCookies, roleRouter);
router.use("/products", verifyByCookies, productRouter);
router.use("/customers", verifyByCookies, customerRouter);

module.exports = router;
