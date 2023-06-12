const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/CustomerController");
const multer = require("../middlewares/Multer");
const { cloudinaryUpload } = require("../middlewares/CloudinaryUpload");

router.get("/", CustomerController.getAllCustomer);
router.get("/:id", CustomerController.getCustomer);

router.get("/user/:sellerId", CustomerController.getCustomersBySellerId);

router.post(
    "/",
    multer.single("image"),
    cloudinaryUpload,
    CustomerController.createCustomer
);

router.put(
    "/:id",
    multer.single("image"),
    cloudinaryUpload,
    CustomerController.updateCustomer
);
router.patch(
    "/:id",
    multer.single("image"),
    cloudinaryUpload,
    CustomerController.updateCustomer
);
router.delete("/:id", CustomerController.deleteCustomer);

module.exports = router;
