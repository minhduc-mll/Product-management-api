const jwt = require("jsonwebtoken");
const Account = require("../models/Account");

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Missing input" });
    }
    // Find user account by username and password
    try {
        const user = await Account.findOne({
            username: username,
            password: password,
        });
        if (user == null) {
            return res
                .status(500)
                .json({ message: "Invalid username or password" });
        }
        // Create access token with user id
        let accessToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
        return res
            .status(200)
            .send({ message: "Login successful", accessToken });
    } catch (err) {
        return res.status(500).send({ message: err.message });
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
        return res.status(401).json({ message: "Missing input" });
    }
    if (newPassword === oldPassword) {
        return res.status(401).json({
            message: "New password must be different from old password",
        });
    }
    // Check old password with account password
    if (oldPassword !== req.account.password) {
        return res.status(401).json({ message: "Invalid password" });
    }
    try {
        // Save new password
        req.account.password = newPassword;
        await req.account.save();
        return res.status(200).json({ message: "Change password successful" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    login,
    logout,
    changePassword,
};
