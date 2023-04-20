const Category = require("../models/Category");
const Product = require("../models/Product");

const getAllCategory = async (req, res) => {
    const q = req.query;
    const filters = {
        ...(q.title && { title: q.title }),
        ...(q.desc && { desc: q.desc }),
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };

    try {
        // Get all categories with filters
        const categories = await Category.find(filters)
            .select({ __v: 0 })
            .limit(q.limit)
            .sort({ [q.sort]: -1, createAt: -1 });
        if (!categories) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json(categories);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getCategory = async (req, res) => {
    try {
        // Get category by id
        const category = await Category.findOne({
            _id: req.params.id,
        }).select({ __v: 0, password: 0 });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json(category);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const createCategory = async (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({ message: "Missing input" });
    }
    try {
        // Create new category
        const newCategory = new Category({
            updatedBy: req.userId,
            ...req.body,
        });
        await newCategory.save();
        return res.status(201).json(newCategory);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const updateCategory = async (req, res) => {
    try {
        // Find category and update
        await Category.findOneAndUpdate(
            { _id: req.params.id },
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

const deleteCategory = async (req, res) => {
    try {
        // Find category and delete
        const category = await Category.findOneAndDelete({
            _id: req.params.id,
        });
        return res.status(200).json(category);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const countCategories = async (req, res) => {
    try {
        // Count all categories
        const count = await Category.countDocuments().exec();
        return res.status(200).json(count);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

module.exports = {
    getAllCategory,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    countCategories,
};
