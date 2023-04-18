const express = require("express");
const router = express.Router();
const EventController = require("../controllers/EventController");

router.get("/productEvent", EventController.getProductEvents);
router.get(
    "/productEvent/:productId",
    EventController.getProductEventByProductId
);

router.get("/productArrivalEvent", EventController.getProductArrivalEvents);
router.get(
    "/productArrivalEvent/:productId",
    EventController.getProductArrivalEventByProductId
);

module.exports = router;
