const Product = require("../models/Product");

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
            .select({ __v: 0, payment: 0 })
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
            .select({ __v: 0, payment: 0 })
            .limit(q.limit)
            .sort({ createdAt: -1, [q.sortName]: dsc })
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
            .select({ __v: 0, payment: 0 })
            .limit(q.limit)
            .sort({ createdAt: -1, [q.sortName]: dsc })
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
            .select({ __v: 0, payment: 0 })
            .limit(q.limit)
            .sort({ createdAt: -1, [q.sortName]: dsc })
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
        // const product = await Product.findOne({
        //     productId: productId,
        // })
        //     .select({ __v: 0, payment: 0 })
        //     .exec();
        const products = await Product.aggregate([
            {
                $match: {
                    productId: productId,
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
                $lookup: {
                    from: "users",
                    localField: "sellerId",
                    foreignField: "_id",
                    as: "seller",
                },
            },
            {
                $lookup: {
                    from: "customers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customer",
                },
            },
            {
                $addFields: {
                    category: { $first: "$category" },
                    seller: { $first: "$seller" },
                    customer: { $first: "$customer" },
                },
            },
            {
                $project: { __v: 0, payment: 0 },
            },
        ]).exec();
        const product = products[0];
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
            productId: req.body.productId,
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
        if (productExists && productExists.productId != productId) {
            return res.status(409).json({
                message: "Product exists.",
            });
        }
        // Find product and update
        if (!req.body.productId) {
            req.body.productId = productId;
        }
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

const countProducts = async (req, res) => {
    try {
        // Count all products
        const count = await Product.countDocuments().exec();
        return res.status(200).json(count);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProductPayment = async (req, res) => {
    const productId = req.params.productId;
    try {
        // Get payment product by id
        const product = await Product.findOne({
            productId: productId,
        })
            .select({ payment: 1 })
            .exec();
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
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
    countProducts,
    getProductPayment,
};
