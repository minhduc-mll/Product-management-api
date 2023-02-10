const Account = require("../models/Account");

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await Account.findOne({ username: username });
    if (!user) {
        return res
            .status(500)
            .send({ message: "User doesn't exist with this email account." });
    }
    if (password != user.password) {
        return res.status(500).send({ message: "Invalid Password!" });
    }
    return res.status(200).send({ user, message: "Login successful" });
};

const logout = async (req, res) => {
    return res.status(200).send({ message: "Logout successful" });
};

module.exports = {
    login,
    logout
};
