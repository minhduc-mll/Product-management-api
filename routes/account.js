const express = require("express");
const AccountController = require("../controllers/AccountController");
const router = express.Router();

// Get all accounts
router.get("/", AccountController.getAllAccount);

// Get account by id
router.get("/:id", AccountController.getAccount);

// Create a new account
router.post("/", AccountController.createAccount);

// Update account
router.put("/:id", AccountController.updateAccount);

// Delete an account
router.delete("/:id", AccountController.deleteAccount);

module.exports = router;
