const express = require("express");
const router = express.Router();
const EventController = require("../controllers/EventController");

router.get("/", EventController.getProductEvents);
router.get("/:productId", EventController.getProductEventByProductId);

router.get("/arrivalEvent", EventController.getProductArrivalEvents);
router.get(
    "/arrivalEvent/:productId",
    EventController.getProductArrivalEventByProductId
);

module.exports = router;
