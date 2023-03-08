const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const accountRouter = require("./account");
const containerRouter = require("./container");
const customerRouter = require("./customer");

router.use("/auth", authRouter);
router.use("/accounts", accountRouter);
router.use("/containers", containerRouter);
router.use("/customers", customerRouter);

module.exports = router;
