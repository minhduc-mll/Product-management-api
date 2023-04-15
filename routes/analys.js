const express = require("express");
const router = express.Router();
const { countUsers } = require("../controllers/UserController");
const {
    countProducts,
    getTotalDeposit,
    countProductsByMonth,
    countSellerProductsByMonth,
    countCustomerProductsByMonth,
} = require("../controllers/ProductController");
const { countCustomers } = require("../controllers/CustomerController");
const { verifyAdmin } = require("../middlewares/PermissionHandler");

router.get("/users", verifyAdmin, countUsers);

router.get("/products", verifyAdmin, countProducts);

router.get("/customers", verifyAdmin, countCustomers);

router.get("/totalDeposit", verifyAdmin, getTotalDeposit);

router.get("/productsByMonth", countProductsByMonth);

router.get("/userProductsByMonth/:sellerId", countSellerProductsByMonth);

router.get(
    "/customerProductsByMonth/:customerId",
    countCustomerProductsByMonth
);

module.exports = router;
