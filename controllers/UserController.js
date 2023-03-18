const User = require("../models/User");
const Role = require("../models/Role");

const getAllUser = async (req, res) => {
    const limit = Number(req.body.limit) || 0;
    const sort = req.body.sort == "desc" ? -1 : 1;

    try {
        // Get all users
        const users = await User.find()
            .select("-_id -__v")
            .limit(limit)
            .sort({ id: sort });
        return res.status(200).json(users);
    } catch (err) {
        console.error(err);
    }
};

const getUser = async (req, res) => {
    try {
        // Get user by id
        const user = await User.findOne({
            id: req.params.id,
        }).select("-_id -__v");
        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
    }
};

const createUser = async (req, res) => {
    if (typeof req.body == "undefined") {
        return res.status(400).json({
            status: "error",
            message: "data is undefined",
        });
    }

    const { username, password, firstname, lastname, email, phone, role } =
        req.body;
    if (!username || !password || !role) {
        return res
            .status(400)
            .json({ status: "error", message: "Missing input" });
    }
    try {
        // Find if user already exists
        const userExists = await User.findOne({
            username: username,
        });
        if (userExists) {
            return res.status(500).json({
                message: "User already exists.",
            });
        }
        // If user not exist, create new user
        const role = await Role.findOne({
            rolename: req.body.role,
        }).select("-__v");
        User.find().countDocuments(async function (err, count) {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: err,
                });
            }
            const newUser = new User({
                id: count + 1,
                username: username,
                password: password,
                name: {
                    firstname: firstname,
                    lastname: lastname,
                },
                email: email,
                phone: phone,
                role: role,
            });
            await newUser.save();
            return res.status(201).json(newUser);
        });
    } catch (err) {
        console.error(err);
    }
};

const updateUser = async (req, res) => {
    if (typeof req.body == "undefined" || req.params.id == null) {
        res.status(400).json({
            status: "error",
            message: "something went wrong! check your sent data",
        });
    }

    try {
        // Find if username already exists
        const userExists = await User.findOne({
            username: req.body.username,
        });
        if (userExists) {
            return res
                .status(500)
                .json({ status: "error", message: "Username already exists." });
        }
        // If username not exist, find user and update
        const role = await Role.findOne({
            rolename: req.body.role,
        }).select("-__v");
        await User.findOneAndUpdate(
            { id: req.params.id },
            {
                $set: {
                    username: req.body.username,
                    password: req.body.password,
                    name: {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                    },
                    email: req.body.email,
                    phone: req.body.phone,
                    role,
                },
            }
        );
        return res.status(202).json({ message: "Update successful" });
    } catch (err) {
        console.error(err);
    }
};

const deleteUser = async (req, res) => {
    if (req.params.id == null) {
        res.status(400).json({
            status: "error",
            message: "id should be provided",
        });
    }

    try {
        // Find user and delete
        const user = await User.findOneAndDelete({
            id: req.params.id,
        });
        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    getAllUser,
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
