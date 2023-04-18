const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middlewares/PermissionHandler");
const { countUsers } = require("../controllers/UserController");
const { countCustomers } = require("../controllers/CustomerController");
const ProductController = require("../controllers/ProductController");

router.get("/users", verifyAdmin, countUsers);

router.get("/customers", verifyAdmin, countCustomers);

router.get("/totalDeposit", verifyAdmin, ProductController.getTotalDeposit);

router.get("/products", verifyAdmin, ProductController.countProducts);

router.get(
    "/productsMonth/:month",
    verifyAdmin,
    ProductController.countProductsMonth
);

router.get("/productsByMonth", ProductController.countProductsByMonth);

router.get(
    "/userProductsByMonth/:sellerId",
    ProductController.countSellerProductsByMonth
);

router.get(
    "/customerProductsByMonth/:customerId",
    ProductController.countCustomerProductsByMonth
);

router.get("/productsInStock", ProductController.countProductsInStock);

module.exports = router;
