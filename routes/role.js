const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/RoleController");

router.get("/", RoleController.getAllRole);
router.get("/:id", RoleController.getRole);

router.post("/", RoleController.createRole);

router.put("/:id", RoleController.updateRole);
router.patch("/:id", RoleController.updateRole);
router.delete("/:id", RoleController.deleteRole);

module.exports = router;
