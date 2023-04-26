const Product = require("../models/Product");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Category = require("../models/Category");
const { monthNames } = require("../middlewares/i18n");

const getAllProducts = async (req, res) => {
    const q = req.query;
    const filters = {
        ...(q.productId && { productId: q.productId }),
        ...((q.minPrice || q.maxPrice) && {
            price: {
                ...(q.minPrice && { $gt: q.minPrice }),
                ...(q.maxPrice && { $lt: q.maxPrice }),
            },
        }),
        ...((q.minDeposit || q.maxDeposit) && {
            deposit: {
                ...(q.minDeposit && { $gt: q.minDeposit }),
                ...(q.maxDeposit && { $lt: q.maxDeposit }),
            },
        }),
        ...((q.startArrivalDate || q.endArrivalDate) && {
            arrivalDate: {
                ...(q.startArrivalDate && { $gt: q.startArrivalDate }),
                ...(q.endArrivalDate && { $lt: q.endArrivalDate }),
            },
        }),
        ...((q.startDeliveryDate || q.endDeliveryDate) && {
            deliveryDate: {
                ...(q.startDeliveryDate && { $gt: q.startDeliveryDate }),
                ...(q.endDeliveryDate && { $lt: q.endDeliveryDate }),
            },
        }),
        ...(q.desc && { desc: q.desc }),
        ...(q.port && { port: q.port }),
        ...(q.status && { status: q.status }),
        ...(q.search && {
            $or: [
                {
                    productId: { $regex: q.search, $options: "i" },
                },
                {
                    desc: { $regex: q.search, $options: "i" },
                },
            ],
        }),
    };

    const dsc = q.sortOrder === "dsc" ? -1 : 1;

    try {
        // Get all products with filters
        const products = await Product.find(filters)
            .select({ __v: 0 })
            .limit(q.limit)
            .sort({ [q.sortName]: dsc })
            .exec();
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProductsByCategoryId = async (req, res) => {
    const categoryId = req.params.categoryId;
    const q = req.query;
    const dsc = q.sortOrder === "dsc" ? -1 : 1;
    try {
        // Get products by category id
        const products = await Product.find({
            categoryId: categoryId,
        })
            .select({ __v: 0 })
            .limit(q.limit)
            .sort({ [q.sortName]: dsc, createdAt: -1 })
            .exec();
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProductsBySellerId = async (req, res) => {
    const sellerId = req.params.sellerId;
    const q = req.query;
    const dsc = q.sortOrder === "dsc" ? -1 : 1;
    try {
        // Get products by seller id
        const products = await Product.find({
            sellerId: sellerId,
        })
            .select({ __v: 0 })
            .limit(q.limit)
            .sort({ [q.sortName]: dsc, createdAt: -1 })
            .exec();
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProductsByCustomerId = async (req, res) => {
    const customerId = req.params.customerId;
    const q = req.query;
    const dsc = q.sortOrder === "dsc" ? -1 : 1;
    try {
        // Get products by customer id
        const products = await Product.find({
            customerId: customerId,
        })
            .select({ __v: 0 })
            .limit(q.limit)
            .sort({ [q.sortName]: dsc, createdAt: -1 })
            .exec();
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProduct = async (req, res) => {
    const productId = req.params.productId;
    try {
        // Get product by id
        const product = await Product.findOne({
            productId: productId,
        })
            .select({ __v: 0 })
            .exec();
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const createProduct = async (req, res) => {
    try {
        if (!req.body.productId) {
            return res.status(400).json({ message: "Missing input" });
        }
        // Find if product already exists
        const productExists = await Product.findOne({
            productId: req.body.productId,
        });
        if (productExists) {
            return res.status(409).json({
                message: "Product exists.",
            });
        }
        // If product not exists, create new product
        const newProduct = new Product({
            updatedBy: req.userId,
            ...req.body,
        });
        await newProduct.save();
        return res.status(201).json(newProduct);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const updateProduct = async (req, res) => {
    const productId = req.params.productId;
    try {
        // Find if product already exists
        const productExists = await Product.findOne({
            productId: productId,
        });
        if (productExists) {
            return res.status(409).json({
                message: "Product exists.",
            });
        }
        // Find product and update
        await Product.findOneAndUpdate(
            { productId: productId },
            {
                $set: {
                    updatedBy: req.userId,
                    ...req.body,
                },
            }
        );
        return res.status(202).json("Update successful");
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const deleteProduct = async (req, res) => {
    const productId = req.params.productId;
    try {
        // Find product and delete
        await Product.findOneAndDelete({
            productId: productId,
        });
        return res.status(200).json("Deleted!");
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

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
        return res.status(200).json(totalDepositSold[0].total);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const countProducts = async (req, res) => {
    try {
        // Count all products
        const count = await Product.countDocuments().exec();
        return res.status(200).json(count);
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
                        $eq: [{ $year: "$createdAt" }, year],
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
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
                        $eq: [{ $year: "$createdAt" }, year],
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
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
        // Count all products
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

        // Count all products
        const count = await Product.countDocuments({
            categoryId: category._id,
        }).exec();
        return res.status(200).json(count);
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
                        $eq: [{ $year: "$createdAt" }, year],
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
                $project: { createdAt: 1, name: 1, username: 1 },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
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
        const year = parseInt(req.params.year) || new Date().getFullYear();
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

        const countProductsByMonth = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $year: "$createdAt" }, year],
                    },
                },
            },
            { $project: { createdAt: 1 } },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    count: { $count: {} },
                },
            },
            { $sort: { "_id.month": 1 } },
        ]).exec();

        const categoryAnalysis = [];
        categoryAnalysis.push(
            ...countProductsByMonth?.map((value) => {
                return {
                    month: monthNames[value._id.month - 1],
                    totalProducts: value.count,
                };
            }),
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
        return res.status(200).json(categoryAnalysis);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

module.exports = {
    getAllProducts,
    getProductsByCategoryId,
    getProductsBySellerId,
    getProductsByCustomerId,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getTotalDeposit,
    countProducts,
    countProductsMonth,
    countProductsByMonth,
    countSellerProductsByMonth,
    countCustomerProductsByMonth,
    countProductsInStock,
    countProductsInCategory,
    getProductsPerSellerByMonth,
    getProductsPerCategoryByMonth,
};
