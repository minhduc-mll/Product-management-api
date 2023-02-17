const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const AuthHandler = require("../middlewares/AuthHandler");

router.post("/login", AuthController.login);

router.post("/logout", AuthHandler, AuthController.logout);

router.post("/change_password", AuthHandler, AuthController.changePassword);

module.exports = router;
