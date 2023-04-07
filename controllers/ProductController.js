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

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};
