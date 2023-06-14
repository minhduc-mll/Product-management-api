const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const isBcrypt = true;
const TOKEN = process.env.JWT_TOKEN;

const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json("Missing input");
    }
    try {
        // Find if user already exists
        const userExists = await User.findOne({
            username: username,
        })
            .select({ __v: 0 })
            .exec();
        if (userExists) {
            return res.status(409).json("User already exists.");
        }
        // Find if email already exists
        const emailExists = await User.findOne({
            email: email,
        })
            .select({ __v: 0 })
            .exec();
        if (emailExists) {
            return res.status(409).json("Email already exists.");
        }
        // If user not exist, create new user
        const hashPassword = bcrypt.hashSync(password, 6);
        const newUser = await User.create({
            username: username,
            email: email,
            password: hashPassword,
            ...req.body,
        });
        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json("Missing input");
    }
    try {
        // Find user account by username
        const user = await User.findOne({
            username: username,
        })
            .select({ __v: 0 })
            .exec();
        if (!user) {
            return res.status(404).json("User not found!");
        }
        // Check password
        if (isBcrypt) {
            if (bcrypt.compareSync(user.password, req.body.password)) {
                return res.status(400).json("Invalid username or password");
            }
        } else {
            if (user.password !== req.body.password) {
                return res.status(400).json("Invalid username or password");
            }
        }

        // Create access token with user id
        let accessToken = jwt.sign({ id: user._id, role: user.role }, TOKEN);

        const { password, ...info } = user._doc;
        return res
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                // maxAge: 24 * 60 * 60 * 1000,
                sameSite: "none",
            })
            .status(200)
            .json(info);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const logout = async (req, res) => {
    return res
        .clearCookie("accessToken", {
            sameSite: "none",
            secure: true,
        })
        .status(200)
        .json("Logout successful");
};

const updateProfile = async (req, res) => {
    const userId = req.params.id;
    try {
        if (userId != req.userId) {
            return res.status(403).json("User don't have permission!");
        }
        await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
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

const changePassword = async (req, res) => {
    // Get old password and change password
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    try {
        if (!oldPassword || !newPassword) {
            return res.status(401).json("Missing input");
        }
        if (newPassword === oldPassword) {
            return res
                .status(401)
                .json("New password must be different from old password");
        }
        // Check old password with user password
        const user = await User.findById(req.userId).exec();

        if (!user) {
            return res.status(404).json("User not found!");
        }

        if (isBcrypt) {
            if (bcrypt.compareSync(user.password, oldPassword)) {
                return res.status(401).json("Invalid password");
            }
            // Save new password
            user.password = bcrypt.hashSync(password, 6);
        } else {
            if (oldPassword !== user.password) {
                return res.status(401).json("Invalid password");
            }
            // Save new password
            user.password = newPassword;
        }
        await user.save();
        return res.status(200).json("Change password successful");
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

module.exports = {
    register,
    login,
    logout,
    updateProfile,
    changePassword,
};
