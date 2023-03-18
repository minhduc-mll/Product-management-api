const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
    console.log(req.headers["authorization"]);
    const Header = req.headers["authorization"];

    if (typeof Header == "undefined") {
        return res.status(403).send({
            status: "error",
            message: "data is undefined",
        });
    }
    // Get user id from jwt token
    const { id } = jwt.verify(Header, process.env.TOKEN_SECRET);
    if (id == null) {
        return res.status(500).json({
            message: "Invalid token",
        });
    }
    try {
        // Find user with user id
        const user = await User.findById(id);
        if (user == null) {
            return res.status(500).json({
                message: "User not found",
            });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
    }
};
