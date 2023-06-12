const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const multer = require("../middlewares/Multer");

router.get("/", ProductController.getAllProducts);
router.get("/:productId", ProductController.getProduct);

router.get("/category/:categoryId", ProductController.getProductsByCategoryId);
router.get("/user/:sellerId", ProductController.getProductsBySellerId);
router.get("/customer/:customerId", ProductController.getProductsByCustomerId);

router.post("/", multer.single("image"), ProductController.createProduct);

router.put(
    "/:productId",
    multer.single("image"),
    ProductController.updateProduct
);
router.patch(
    "/:productId",
    multer.single("image"),
    ProductController.updateProduct
);
router.delete("/:productId", ProductController.deleteProduct);

router.get("/payment/:productId", ProductController.getProductPayment);

module.exports = router;
