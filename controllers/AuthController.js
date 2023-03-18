const jwt = require("jsonwebtoken");
const User = require("../models/User");

const read = async (req, res) => {
    return res.json("login");
};

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({ status: "error", message: "Missing input" });
    }
    // Find user account by username and password
    try {
        const user = await User.findOne({
            username: username,
            password: password,
        });
        if (user == null) {
            return res.status(500).json({
                status: "error",
                message: "Invalid username or password",
            });
        }
        // Create access token with user id
        let accessToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
        return res
            .status(200)
            .json({ message: "Login successful", accessToken });
    } catch (err) {
        console.error(err);
    }
};

const logout = async (req, res) => {
    return res.status(200).json({ message: "Logout successful" });
};

const changePassword = async (req, res) => {
    // Get old password and change password
    let oldPassword = req.body.old_password;
    let newPassword = req.body.new_password;

    if (!oldPassword || !newPassword) {
        return res
            .status(401)
            .json({ status: "error", message: "Missing input" });
    }
    if (newPassword === oldPassword) {
        return res.status(401).json({
            status: "error",
            message: "New password must be different from old password",
        });
    }
    // Check old password with account password
    if (oldPassword !== req.account.password) {
        return res
            .status(401)
            .json({ status: "error", message: "Invalid password" });
    }
    try {
        // Save new password
        req.account.password = newPassword;
        await req.account.save();
        return res.status(200).json({ message: "Change password successful" });
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    read,
    login,
    logout,
    changePassword,
};
