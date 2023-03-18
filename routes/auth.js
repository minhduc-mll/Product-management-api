const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const AuthHandler = require("../middlewares/AuthHandler");

router.get("/", AuthController.read);

router.post("/login", AuthController.login);

router.get("/logout", AuthHandler, AuthController.logout);

router.post("/change_password", AuthHandler, AuthController.changePassword);

module.exports = router;
