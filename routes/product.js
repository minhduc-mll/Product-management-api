const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

router.get("/", ProductController.getAllProducts);
router.get("/:productId", ProductController.getProduct);

router.get("/user/:sellerId", ProductController.getProductsBySellerId);
router.get("/customer/:customerId", ProductController.getProductsByCustomerId);

router.post("/", ProductController.createProduct);

router.put("/:productId", ProductController.updateProduct);
router.patch("/:productId", ProductController.updateProduct);
router.delete("/:productId", ProductController.deleteProduct);

module.exports = router;
