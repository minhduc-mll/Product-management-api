const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyByHeader = async (req, res, next) => {
    const header = req.headers["authorization"];

    if (!header) {
        return res.status(401).json({
            message: "You are not authenticated!",
        });
    }
    // Get user id from jwt token
    jwt.verify(header, process.env.JWT_TOKEN, async (err, payload) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid token",
            });
        }
        try {
            // Find user with user id
            const user = await User.findById(payload.id);
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            req.userId = payload.id;
            req.role = payload.role;
            next();
        } catch (err) {
            return res.status(500).json("Something went wrong!");
        }
    });
};

const verifyByCookies = async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).send({
            message: "You are not authenticated!",
        });
    }
    // Get user id from jwt token
    jwt.verify(token, process.env.JWT_TOKEN, async (err, payload) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid token",
            });
        }
        try {
            // Find user with user id
            const user = await User.findById(payload.id).select({
                __v: 0,
                password: 0,
            });
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            req.userId = payload.id;
            req.role = payload.role;
            next();
        } catch (err) {
            return res.status(500).json("Something went wrong!");
        }
    });
};

module.exports = {
    verifyByHeader,
    verifyByCookies,
};
