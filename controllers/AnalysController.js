const Product = require("../models/Product");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Category = require("../models/Category");
const { monthNames } = require("../middlewares/i18n");

const getTotalDeposit = async (req, res) => {
    try {
        // Get total deposit of sold products
        const totalDepositSold = await Product.aggregate([
            {
                $match: { status: "sold" },
            },
            {
                $group: {
                    _id: "$status",
                    total: { $sum: "$deposit" },
                },
            },
        ]).exec();
        const deposit = totalDepositSold[0]?.total || 0;
        return res.status(200).json(deposit);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getTotalRevenueByMonth = async (req, res) => {
    try {
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        const year = parseInt(req.query.year) || new Date().getFullYear();
        // Get total revenue by month
        const totalRevenueByMonth = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $month: "$deliveryDate" }, month] },
                            { $eq: [{ $year: "$deliveryDate" }, year] },
                        ],
                    },
                    status: "done",
                },
            },
            {
                $group: {
                    _id: "$status",
                    total: { $sum: "$amount" },
                },
            },
        ]).exec();
        const revenue = totalRevenueByMonth[0]?.total || 0;
        return res.status(200).json(revenue);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getTotalProfitsByMonth = async (req, res) => {
    try {
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        const year = parseInt(req.query.year) || new Date().getFullYear();
        // Get total revenue by month
        const totalPayMentAndAmountByMonth = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $month: "$deliveryDate" }, month] },
                            { $eq: [{ $year: "$deliveryDate" }, year] },
                        ],
                    },
                    status: "done",
                },
            },
            {
                $group: {
                    _id: "$status",
                    payment: { $sum: "$payment" },
                    amount: { $sum: "$amount" },
                },
            },
        ]).exec();
        const profits =
            totalPayMentAndAmountByMonth[0]?.amount -
                totalPayMentAndAmountByMonth[0]?.payment || 0;
        return res.status(200).json(profits);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const countProductsMonth = async (req, res) => {
    try {
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        const year = parseInt(req.query.year) || new Date().getFullYear();

        // Count products by month
        const countProductsMonth = await Product.countDocuments({
            $expr: {
                $and: [
                    { $eq: [{ $month: "$arrivalDate" }, month] },
                    { $eq: [{ $year: "$arrivalDate" }, year] },
                ],
            },
        }).exec();
        return res.status(200).json(countProductsMonth);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const countProductsByMonth = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();

        // Count products by month
        const countProductsByMonth = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $year: "$createdAt" }, year],
                    },
                },
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    count: { $count: {} },
                },
            },
            { $sort: { "_id.month": 1 } },
        ]).exec();

        const productsByMonth = [];
        productsByMonth.push(
            ...countProductsByMonth?.map((value) => {
                return {
                    month: monthNames[value._id.month - 1],
                    products: value.count,
                };
            })
        );
        return res.status(200).json(productsByMonth);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const countSellerProductsByMonth = async (req, res) => {
    const sellerId = req.params.sellerId;
    try {
        // Find seller by sellerId
        const seller = await User.findOne({
            _id: sellerId,
        })
            .select({ __v: 0 })
            .exec();
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const year = parseInt(req.query.year) || new Date().getFullYear();
        // Count seller products by month
        const countSellerProductsByMonth = await Product.aggregate([
            {
                $match: {
                    sellerId: seller._id,
                    $expr: {
                        $eq: [{ $year: "$saleDate" }, year],
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$saleDate" },
                        sellerId: "$sellerId",
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.month": 1 } },
        ]).exec();

        const sellerProductsByMonth = [];
        sellerProductsByMonth.push(
            ...countSellerProductsByMonth?.map((value) => {
                return {
                    month: monthNames[value._id.month - 1],
                    products: value.count,
                };
            })
        );
        return res.status(200).json(sellerProductsByMonth);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const countCustomerProductsByMonth = async (req, res) => {
    const customerId = req.params.customerId;
    try {
        // Find customer by customerId
        const customer = await Customer.findOne({
            _id: customerId,
        })
            .select({ __v: 0 })
            .exec();
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const year = parseInt(req.query.year) || new Date().getFullYear();
        // Count customer products by month
        const countCustomerProductsByMonth = await Product.aggregate([
            {
                $match: {
                    customerId: customer._id,
                    $expr: {
                        $eq: [{ $year: "$saleDate" }, year],
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$saleDate" },
                        customerId: "$customerId",
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.month": 1 } },
        ]).exec();

        const customerProductsByMonth = [];
        customerProductsByMonth.push(
            ...countCustomerProductsByMonth?.map((value) => {
                return {
                    month: monthNames[value._id.month - 1],
                    products: value.count,
                };
            })
        );
        return res.status(200).json(customerProductsByMonth);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const countProductsInStock = async (req, res) => {
    try {
        // Count all products with pending status
        const count = await Product.countDocuments({
            status: "pending",
        }).exec();
        return res.status(200).json(count);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const countProductsInCategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        // Find category by categoryId
        const category = await Category.findOne({
            _id: categoryId,
        })
            .select({ __v: 0 })
            .exec();
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Count all products in category
        const count = await Product.countDocuments({
            categoryId: category._id,
        }).exec();
        return res.status(200).json(count);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const countProductsWithStatus = async (req, res) => {
    const status = req.query.status;
    try {
        // Count products with status
        const count = await Product.countDocuments({
            status: status,
        }).exec();
        return res.status(200).json(count);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProductsPerSellerOneMonth = async (req, res) => {
    try {
        const month = parseInt(req.query.month) || new Date().getMonth() + 1;
        const year = parseInt(req.query.year) || new Date().getFullYear();
        // Count products per seller by month
        const countProductsPerSellerOneMonth = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $year: "$saleDate" }, year] },
                            { $eq: [{ $month: "$saleDate" }, month] },
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sellerId",
                    foreignField: "_id",
                    as: "seller",
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            { $arrayElemAt: ["$seller", 0] },
                            "$$ROOT",
                        ],
                    },
                },
            },
            {
                $project: { saleDate: 1, name: 1, username: 1 },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$saleDate" },
                        seller: "$username",
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.month": 1, count: -1 } },
        ]).exec();

        const sellerAnalysis = [];
        sellerAnalysis.push(
            ...countProductsPerSellerOneMonth?.map((value) => {
                return {
                    name: value._id.seller || "not sold yet",
                    product: value.count,
                };
            })
        );
        return res.status(200).json(sellerAnalysis);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProductsPerSellerByMonth = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        // Count products per seller by month
        const countProductsPerSellerByMonth = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $year: "$saleDate" }, year],
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sellerId",
                    foreignField: "_id",
                    as: "seller",
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            { $arrayElemAt: ["$seller", 0] },
                            "$$ROOT",
                        ],
                    },
                },
            },
            {
                $project: { saleDate: 1, name: 1, username: 1 },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$saleDate" },
                        seller: "$username",
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.month": 1, count: -1 } },
        ]).exec();

        const sellerAnalysis = [];
        sellerAnalysis.push(
            ...countProductsPerSellerByMonth?.map((value) => {
                return {
                    month: monthNames[value._id.month - 1],
                    [value._id.seller || "not sold yet"]: value.count,
                };
            })
        );

        const monthAnalysis = [];
        sellerAnalysis.forEach((item) => {
            let existing = monthAnalysis.filter((value, index) => {
                return value.month == item.month;
            });

            if (existing.length) {
                let existingIndex = monthAnalysis.indexOf(existing[0]);
                monthAnalysis[existingIndex] = {
                    ...monthAnalysis[existingIndex],
                    ...item,
                };
            } else {
                monthAnalysis.push(item);
            }
        });
        return res.status(200).json(monthAnalysis);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProductsPerCategoryByMonth = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        // Get products in each category by month
        const countProductsPerCategoryByMonth = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $year: "$createdAt" }, year],
                    },
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            { $arrayElemAt: ["$category", 0] },
                            "$$ROOT",
                        ],
                    },
                },
            },
            {
                $project: { createdAt: 1, title: 1 },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        category: "$title",
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.month": 1, count: -1 } },
        ]).exec();

        const categoryAnalysis = [];
        categoryAnalysis.push(
            ...countProductsPerCategoryByMonth?.map((value) => {
                return {
                    month: monthNames[value._id.month - 1],
                    [value._id.category || ""]: value.count,
                };
            })
        );

        const monthAnalysis = [];
        categoryAnalysis.forEach((item) => {
            let existing = monthAnalysis.filter((value, index) => {
                return value.month == item.month;
            });

            if (existing.length) {
                let existingIndex = monthAnalysis.indexOf(existing[0]);
                monthAnalysis[existingIndex] = {
                    ...monthAnalysis[existingIndex],
                    ...item,
                };
            } else {
                monthAnalysis.push(item);
            }
        });
        return res.status(200).json(monthAnalysis);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProfitsByMonth = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const getProfitsByMonth = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $year: "$deliveryDate" }, year],
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$deliveryDate" },
                    },
                    payment: { $sum: "$payment" },
                    amount: { $sum: "$amount" },
                },
            },
            { $sort: { "_id.month": 1 } },
        ]).exec();

        const profitsByMonth = [];
        profitsByMonth.push(
            ...getProfitsByMonth?.map((value) => {
                return {
                    month: monthNames[value._id.month - 1],
                    profits: Math.ceil(value.amount - value.payment),
                };
            })
        );

        return res.status(200).json(profitsByMonth);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProfitsPerCategoryByMonth = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        // Get profits in each category by month
        const getProfitsPerCategoryByMonth = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $year: "$deliveryDate" }, year],
                    },
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            { $arrayElemAt: ["$category", 0] },
                            "$$ROOT",
                        ],
                    },
                },
            },
            {
                $project: { deliveryDate: 1, title: 1, payment: 1, amount: 1 },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$deliveryDate" },
                        category: "$title",
                    },
                    payment: { $sum: "$payment" },
                    amount: { $sum: "$amount" },
                },
            },
            { $sort: { "_id.month": 1, count: -1 } },
        ]).exec();

        const categoryAnalysis = [];
        categoryAnalysis.push(
            ...getProfitsPerCategoryByMonth?.map((value) => {
                return {
                    month: monthNames[value._id.month - 1],
                    [value._id.category || ""]: Math.ceil(
                        value.amount - value.payment
                    ),
                };
            })
        );

        const monthAnalysis = [];
        categoryAnalysis.forEach((item) => {
            let existing = monthAnalysis.filter((value, index) => {
                return value.month == item.month;
            });

            if (existing.length) {
                let existingIndex = monthAnalysis.indexOf(existing[0]);
                monthAnalysis[existingIndex] = {
                    ...monthAnalysis[existingIndex],
                    ...item,
                };
            } else {
                monthAnalysis.push(item);
            }
        });
        return res.status(200).json(monthAnalysis);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

module.exports = {
    getTotalDeposit,
    getTotalRevenueByMonth,
    getTotalProfitsByMonth,
    countProductsMonth,
    countProductsByMonth,
    countSellerProductsByMonth,
    countCustomerProductsByMonth,
    countProductsInStock,
    countProductsInCategory,
    countProductsWithStatus,
    getProductsPerSellerOneMonth,
    getProductsPerSellerByMonth,
    getProductsPerCategoryByMonth,
    getProfitsByMonth,
    getProfitsPerCategoryByMonth,
};
