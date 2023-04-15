const User = require("../models/User");
const Role = require("../models/Role");

const getAllUser = async (req, res) => {
    const q = req.query;
    const filters = {
        ...(q.username && { username: q.username }),
        ...(q.name && { name: q.name }),
        ...(q.phone && { phone: q.phone }),
        ...(q.email && { email: q.email }),
        ...((q.startDate || q.endDate) && {
            birthday: {
                ...(q.startDate && { $gt: q.startDate }),
                ...(q.endDate && { $lt: q.endDate }),
            },
        }),
        ...(q.role && { role: q.role }),
        ...(q.search && { name: { $regex: q.search, $options: "i" } }),
    };

    try {
        // Get all users with filters
        const users = await User.find(filters)
            .select({ __v: 0, password: 0 })
            .limit(q.limit)
            .sort({ [q.sort]: -1, id: 1 });
        if (!users) {
            return res.status(404).json("User not found");
        }
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getUser = async (req, res) => {
    try {
        // Get user by id
        const user = await User.findOne({
            _id: req.params.id,
        }).select({ __v: 0, password: 0 });
        if (!user) {
            return res.status(404).json("User not found");
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const createUser = async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json("Missing input");
    }
    try {
        // Find if user already exists
        const userExists = await User.findOne({
            username: req.body.username,
        });
        if (userExists) {
            return res.status(409).json("User already exists.");
        }
        // If user not exist, create new user
        User.find().countDocuments(async function (err, count) {
            if (err) {
                return res.status(500).json(err.message);
            }
            const newUser = new User({
                id: count + 1,
                image: req.image,
                ...req.body,
            });
            await newUser.save();
            return res.status(201).json(newUser);
        });
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const updateUser = async (req, res) => {
    try {
        // Find if username already exists
        const userExists = await User.findOne({
            username: req.body.username,
        });
        if (userExists) {
            return res.status(409).json("Username already exists.");
        }
        // If username not exist, find user and update
        await User.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    ...req.body,
                },
            }
        );
        return res.status(202).json("Update successful");
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const deleteUser = async (req, res) => {
    try {
        // Find user and delete
        const user = await User.findOneAndDelete({
            _id: req.params.id,
        });
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const countUsers = async (req, res) => {
    try {
        // Count all user
        const count = await User.countDocuments().exec();
        return res.status(200).json(count);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

module.exports = {
    getAllUser,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    countUsers,
};
