const Category = require("../models/Category");

const getAllCategory = async (req, res) => {
    const q = req.query;
    const filters = {
        ...(q.title && { title: q.title }),
        ...(q.desc && { desc: q.desc }),
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };

    const dsc = q.sortOrder === "dsc" ? -1 : 1;

    try {
        // Get all categories with filters
        const categories = await Category.find(filters)
            .select({ __v: 0 })
            .limit(q.limit)
            .sort({ createdAt: -1, [q.sortName]: dsc })
            .exec();
        return res.status(200).json(categories);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getCategory = async (req, res) => {
    const categoryId = req.params.id;
    try {
        // Get category by id
        const category = await Category.findOne({
            _id: categoryId,
        })
            .select({ __v: 0 })
            .exec();
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
        // Find if category already exists
        const categoryExists = await Category.findOne({
            title: req.body.title,
        }).exec();
        if (categoryExists) {
            return res.status(409).json({
                message: "Category already exists.",
            });
        }
        // If category not exist, create new category
        const newCategory = new Category({
            updatedBy: req.userId,
            image: req.image,
            ...req.body,
        });
        await newCategory.save();
        return res.status(201).json(newCategory);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    try {
        // Find if category already exists
        const categoryExists = await Category.findOne({
            title: req.body.title,
        }).exec();
        if (categoryExists && categoryExists._id != categoryId) {
            return res.status(409).json({
                message: "Category already exists.",
            });
        }
        // If category not exist, find category and update
        await Category.findOneAndUpdate(
            { _id: categoryId },
            {
                $set: {
                    updatedBy: req.userId,
                    image: req.image,
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
    const categoryId = req.params.id;
    try {
        // Find category and delete
        const category = await Category.findOneAndDelete({
            _id: categoryId,
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
