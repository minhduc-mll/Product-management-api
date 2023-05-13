const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middlewares/PermissionHandler");
const { countUsers } = require("../controllers/UserController");
const { countCustomers } = require("../controllers/CustomerController");
const { countCategories } = require("../controllers/CategoryController");
const { countProducts } = require("../controllers/ProductController");
const AnalysController = require("../controllers/AnalysController");

router.get("/users", verifyAdmin, countUsers);

router.get("/customers", verifyAdmin, countCustomers);

router.get("/categories", countCategories);

router.get("/products", countProducts);

router.get("/totalDeposit", verifyAdmin, AnalysController.getTotalDeposit);

router.get(
    "/totalRevenueByMonth",
    verifyAdmin,
    AnalysController.getTotalRevenueByMonth
);

router.get(
    "/totalProfitsByMonth",
    verifyAdmin,
    AnalysController.getTotalProfitsByMonth
);

router.get("/productsMonth", AnalysController.countProductsMonth);

router.get("/productsByMonth", AnalysController.countProductsByMonth);

router.get(
    "/userProductsByMonth/:sellerId",
    AnalysController.countSellerProductsByMonth
);

router.get(
    "/customerProductsByMonth/:customerId",
    AnalysController.countCustomerProductsByMonth
);

router.get(
    "/productsInCategory/:categoryId",
    AnalysController.countProductsInCategory
);

router.get("/productsInStock", AnalysController.countProductsInStock);

router.get("/productsWithStatus", AnalysController.countProductsWithStatus);

router.get(
    "/productsPerUserOneMonth",
    AnalysController.getProductsPerSellerOneMonth
);

router.get(
    "/productsPerUserByMonth",
    AnalysController.getProductsPerSellerByMonth
);

router.get(
    "/productsPerCategoryByMonth",
    AnalysController.getProductsPerCategoryByMonth
);

router.get("/profitsByMonth", AnalysController.getProfitsByMonth);

router.get(
    "/profitsPerCategoryByMonth",
    AnalysController.getProfitsPerCategoryByMonth
);

module.exports = router;
