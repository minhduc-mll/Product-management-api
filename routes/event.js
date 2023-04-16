const express = require("express");
const router = express.Router();
const EventController = require("../controllers/EventController");

router.get("/", EventController.getAllEvent);
router.get("/:id", EventController.getEvent);

router.post("/", EventController.createEvent);

router.put("/:id", EventController.updateEvent);
router.patch("/:id", EventController.updateEvent);
router.delete("/:id", EventController.deleteEvent);

module.exports = router;
