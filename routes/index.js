const express = require("express");
const router = express.Router();
const accountRouter = require("./account");
const authRouter = require("./auth");

router.use("/", authRouter);
router.use("/account", accountRouter);

module.exports = router;
