const express = require("express");
const AuthController = require("../controllers/AuthController");
const router = express.Router();

// Login
router.post("/login", AuthController.login);

// Logout
router.get("/logout", AuthController.logout);

module.exports = router;
