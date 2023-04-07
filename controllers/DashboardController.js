const User = require("../models/User");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

const read = async (req, res) => {
    let queryString = {};
    let lookUpProduct = {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
    };
    let lookUpCustomer = {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
    };

    // Users Overview
    queryString.overview = "users";
    let users = User.aggregate().match({});

    if (req.query.usersType == "customer" && req.query.usersQuery) {
        users = users
            .lookup(lookUpCustomer)
            .unwind({
                preserveNullAndEmptyArrays: false,
                path: "$customer",
            })
            .match({ "customer.phone": req.query.usersQuery });
        queryString.usersType = req.query.usersType;
        queryString.startDate = req.query.usersQuery;
    }

    if (req.query.usersType == "product" && req.query.usersQuery) {
        users = users
            .lookup(lookUpProduct)
            .unwind({
                preserveNullAndEmptyArrays: false,
                path: "$product",
            })
            .match({ "product.code": req.query.usersQuery });
        queryString.usersType = req.query.usersType;
        queryString.usersQuery = req.query.usersQuery;
    }

    if (req.query.startDateUsers) {
        users = users.match({
            usersDate: { $gte: new Date(req.query.startDateUsers) },
        });
        queryString.startDateUsers = req.query.startDateUsers;
    }
    if (req.query.endDateUsers) {
        users = users.match({
            usersDate: { $lt: new Date(req.query.endDateUsers) },
        });
        queryString.endDateUsers = req.query.endDateUsers;
    }
    users = await users.exec();
    const totalUsers = users.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPaid = users.reduce((acc, curr) => acc + curr.paid, 0);
    const totalDue = totalUsers - totalPaid;
    const usersData = { totalUsers, totalPaid, totalDue };

    // // Expense Overview
    // let expenses = Expense.aggregate().match({});
    // let totalExp = 0,
    //     expTypes = req.query.expcat;
    // if (req.query.startDate) {
    //     expenses = expenses.match({
    //         expenseDate: { $gte: new Date(req.query.startDate) },
    //     });
    //     queryString.startDate = req.query.startDate;
    //     queryString.overview = "expense";
    // }
    // if (req.query.endDate) {
    //     expenses = expenses.match({
    //         expenseDate: { $lt: new Date(req.query.endDate) },
    //     });
    //     queryString.endDate = req.query.endDate;
    //     queryString.overview = "expense";
    // }
    // expenses = await expenses.exec();
    // if (expenses) {
    //     if (expTypes)
    //         totalExp = expenses.reduce((acc, curr) => acc + curr[expTypes], 0);
    //     else totalExp = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    //     queryString.expcat = expTypes;
    // }
    // if (expTypes) queryString.overview = "expense";

    // // Inventory overview
    // let entries = Entry.aggregate()
    //     .match({ type: "user" })
    //     .lookup(lookUpProduct)
    //     .unwind({
    //         preserveNullAndEmptyArrays: false,
    //         path: "$product",
    //     });
    // if (req.query.inventoryQuery) {
    //     entries = entries.match({ "product.code": req.query.inventoryQuery });
    //     queryString.inventoryQuery = req.query.inventoryQuery;
    // }

    // if (req.query.startDateInventory) {
    //     entries = entries.match({
    //         createdAt: { $gte: new Date(req.query.startDateInventory) },
    //     });
    //     queryString.startDateInventory = req.query.startDateInventory;
    // }
    // if (req.query.endDateInventory) {
    //     entries = entries.match({
    //         createdAt: { $lt: new Date(req.query.endDateInventory) },
    //     });
    //     queryString.endDateInventory = req.query.endDateInventory;
    // }
    // if (
    //     req.query.inventoryQuery ||
    //     req.query.startDateInventory ||
    //     req.query.endDateInventory
    // )
    //     queryString.overview = "inventory";
    // entries = await entries.exec();
    // let totalUsersUnits = "";
    // if (entries) {
    //     totalUsersUnits = entries.reduce((acc, curr) => acc + curr.quantity, 0);
    // }

    // // Returns Overview
    // let allReturns = ReturnModel.aggregate()
    //     .lookup(lookUpProduct)
    //     .lookup(lookUpCustomer)
    //     .unwind({
    //         preserveNullAndEmptyArrays: false,
    //         path: "$customer",
    //     })
    //     .unwind({
    //         preserveNullAndEmptyArrays: false,
    //         path: "$product",
    //     });
    // if (req.query.startDateReturns) {
    //     allReturns = allReturns.match({
    //         returnDate: { $gte: new Date(req.query.startDateReturns) },
    //     });
    //     queryString.startDateReturns = req.query.startDateReturns;
    // }
    // if (req.query.endDateReturns) {
    //     entries = allReturns.match({
    //         returnDate: { $lt: new Date(req.query.endDateReturns) },
    //     });
    //     queryString.endDateReturns = req.query.endDateReturns;
    // }
    // if (req.query.startDateReturns || req.query.endDateReturns)
    //     queryString.overview = "returns";
    // allReturns = await allReturns.exec();
    // let totalReturnsAmount = "";
    // if (entries) {
    //     totalReturnsAmount = allReturns.reduce(
    //         (acc, curr) => acc + curr.amount,
    //         0
    //     );
    // }

    res.render("dashboard/index", {
        //totalExp,
        queryString,
        usersData,
        //totalUsersUnits,
        //totalReturnsAmount,
    });
};

module.exports = {
    read,
};
