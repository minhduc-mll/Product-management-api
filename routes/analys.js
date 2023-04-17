const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middlewares/PermissionHandler");
const { countUsers } = require("../controllers/UserController");
const {
    countProducts,
    getTotalDeposit,
    countProductsByMonth,
    countSellerProductsByMonth,
    countCustomerProductsByMonth,
} = require("../controllers/ProductController");
const { countCustomers } = require("../controllers/CustomerController");
const {
    getProductArrivalEvent,
    getProductArrivalEventByMonth,
    getProductArrivalEventByProductId,
} = require("../controllers/EventController");

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

router.get("/productArrivalEvent", getProductArrivalEvent);

router.get(
    "/productArrivalEvent/:productId",
    getProductArrivalEventByProductId
);

router.get("/productArrivalEventByMonth", getProductArrivalEventByMonth);

module.exports = router;
