const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const PermissionHandler = require("../middlewares/PermissionHandler");

router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getUser);

router.post("/", UserController.createUser);

router.put("/:id", UserController.updateUser);
router.patch("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
