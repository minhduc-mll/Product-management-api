const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController");
const multer = require("../middlewares/Multer");

router.get("/userTasks", TaskController.getUserTasks);

router.get("/", TaskController.getAllTask);
router.get("/:id", TaskController.getTask);
router.get("/user/:userId", TaskController.getTaskByUserId);

router.post("/", multer.single("image"), TaskController.createTask);

router.put("/:id", TaskController.updateTask);
router.patch("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

module.exports = router;
