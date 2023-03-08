const jwt = require("jsonwebtoken");
const Account = require("../models/Account");

module.exports = async (req, res, next) => {
    try {
        // Get account id from jwt token
        let { id } = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
        if (id == null) {
            return res.status(500).json({
                message: "Invalid token",
            });
        }
        // Find account with account id
        const account = await Account.findById(id);
        if (account == null) {
            return res.status(500).json({
                message: "Account not found",
            });
        }
        req.account = account;
        next();
    } catch (err) {
        console.error(err);
    }
};
