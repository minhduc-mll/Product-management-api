const express = require("express");
const router = express.Router();
const ContainerController = require("../controllers/ContainerController");

router.get("/", ContainerController.getAllContainer);
router.get("/:containerid", ContainerController.getContainer);
router.get("/container/:containerid", ContainerController.getContByContainerId);
router.get("/user/:userid", ContainerController.getContByUserId);
router.get("/customer/:customerid", ContainerController.getContByCustomerId);

router.post("/", ContainerController.createContainer);

router.put("/:containerid", ContainerController.updateContainer);
router.patch("/:containerid", ContainerController.updateContainer);
router.delete("/:containerid", ContainerController.deleteContainer);

module.exports = router;
