const express = require("express");
const router = express.Router();
const AccountController = require("../controllers/AccountController");

router.get("/", AccountController.getAllAccount);
router.get("/:id", AccountController.getAccount);

router.post("/", AccountController.createAccount);

router.put("/:id", AccountController.updateAccount);
router.patch("/:id", AccountController.updateAccount);
router.delete("/:id", AccountController.deleteAccount);

module.exports = router;
