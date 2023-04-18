const Product = require("../models/Product");
const User = require("../models/User");
const Customer = require("../models/Customer");

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
            productId: { $regex: q.search, $options: "i" },
            desc: { $regex: q.search, $options: "i" },
        }),
    };

    try {
        // Get all products with filters
        const products = await Product.find(filters)
            .select({ __v: 0 })
            .limit(q.limit)
            .sort({ [q.sort]: -1, status: -1, timeArrived: -1, createdAt: -1 });
        if (!products) {
            return res.status(404).json("Product not found");
        }
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProductsBySellerId = async (req, res) => {
    try {
        // Find seller by sellerId
        const seller = await User.findOne({
            _id: req.params.sellerId,
        }).select({ __v: 0 });
        if (!seller) {
            return res.status(404).json("Seller not found");
        }
        // Get product by id
        const products = await Product.find({
            sellerId: seller._id,
        }).select({ __v: 0 });
        if (!products) {
            return res
                .status(404)
                .json("This seller does not have any product");
        }
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProductsByCustomerId = async (req, res) => {
    try {
        // Find customer by customerId
        const customer = await Customer.findOne({
            _id: req.params.customerId,
        }).select({ __v: 0 });
        if (!customer) {
            return res.status(404).json("Customer not found");
        }
        // Get product by id
        const products = await Product.find({
            customerId: customer._id,
        }).select({ __v: 0 });
        if (!products) {
            return res
                .status(404)
                .json("This customer does not have any product");
        }
        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProduct = async (req, res) => {
    try {
        // Get product by id
        const product = await Product.findOne({
            productId: req.params.productId,
        }).select({ __v: 0 });
        if (!product) {
            return res.status(404).json("Product not found");
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
    try {
        // Find if product already exists
        const productExists = await Product.findOne({
            productId: req.body.productId,
        });
        if (productExists) {
            return res.status(409).json({
                message: "Product exists.",
            });
        }
        // Find product and update
        await Product.findOneAndUpdate(
            { productId: req.params.productId },
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
    try {
        // Find product and delete
        await Product.findOneAndDelete({
            productId: req.params.productId,
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
            { $match: { status: "sold" } },
            { $group: { _id: "$status", total: { $sum: "$deposit" } } },
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
        const month = parseInt(req.params.month);
        // Count products by month
        const countProductsMonth = await Product.countDocuments({
            $expr: {
                $eq: [{ $month: "$arrivalDate" }, month],
            },
        }).exec();
        return res.status(200).json(countProductsMonth);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const countProductsByMonth = async (req, res) => {
    try {
        // Count products by month
        const countProductsByMonth = await Product.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { month: 1 } },
        ]).exec();
        return res.status(200).json(countProductsByMonth);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const countSellerProductsByMonth = async (req, res) => {
    try {
        // Find seller by sellerId
        const seller = await User.findOne({
            _id: req.params.sellerId,
        }).select({ __v: 0 });
        if (!seller) {
            return res.status(404).json("Seller not found");
        }
        // Count seller products by month
        const countSellerProductsByMonth = await Product.aggregate([
            { $match: { sellerId: seller._id } },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        sellerId: "$sellerId",
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { month: 1 } },
        ]).exec();
        return res.status(200).json(countSellerProductsByMonth);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const countCustomerProductsByMonth = async (req, res) => {
    try {
        // Find customer by customerId
        const customer = await Customer.findOne({
            _id: req.params.customerId,
        }).select({ __v: 0 });
        if (!customer) {
            return res.status(404).json("Customer not found");
        }
        // Count customer products by month
        const countCustomerProductsByMonth = await Product.aggregate([
            { $match: { customerId: customer._id } },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        customerId: "$customerId",
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { month: 1 } },
        ]).exec();
        return res.status(200).json(countCustomerProductsByMonth);
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

module.exports = {
    getAllProducts,
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
};
