const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/CustomerController");

router.get("/", CustomerController.getAllCustomer);
router.get("/:id", CustomerController.getCustomer);

router.post("/", CustomerController.createCustomer);

router.put("/:id", CustomerController.updateCustomer);
router.patch("/:id", CustomerController.updateCustomer);
router.delete("/:id", CustomerController.deleteCustomer);

module.exports = router;
