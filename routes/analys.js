const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middlewares/PermissionHandler");
const { countUsers } = require("../controllers/UserController");
const { countCustomers } = require("../controllers/CustomerController");
const ProductController = require("../controllers/ProductController");
const { countCategories } = require("../controllers/CategoryController");

router.get("/users", verifyAdmin, countUsers);

router.get("/customers", verifyAdmin, countCustomers);

router.get("/categories", verifyAdmin, countCategories);

router.get("/totalDeposit", verifyAdmin, ProductController.getTotalDeposit);

router.get("/products", ProductController.countProducts);

router.get("/productsMonth/:month", ProductController.countProductsMonth);

router.get("/productsByMonth", ProductController.countProductsByMonth);

router.get(
    "/userProductsByMonth/:sellerId",
    ProductController.countSellerProductsByMonth
);

router.get(
    "/customerProductsByMonth/:customerId",
    ProductController.countCustomerProductsByMonth
);

router.get(
    "/productsInCategory/:categoryId",
    ProductController.countProductsInCategory
);

router.get("/productsInStock", ProductController.countProductsInStock);

module.exports = router;
