const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const userRouter = require("./user");
const roleRouter = require("./role");
const containerRouter = require("./container");
const customerRouter = require("./customer");
const dashboardRouter = require("./dashboard");
const PermissionHandler = require("../middlewares/PermissionHandler");
const AuthHandler = require("../middlewares/AuthHandler");

router.use("/", authRouter);
router.use("/dashboard", AuthHandler, dashboardRouter);
router.use("/users", AuthHandler, userRouter);
router.use("/roles", AuthHandler, roleRouter);
router.use("/containers", AuthHandler, containerRouter);
router.use("/customers", AuthHandler, customerRouter);

module.exports = router;
