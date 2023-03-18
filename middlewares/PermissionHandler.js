const Role = require("../models/Role");

const verifyAdmin = async (req, res, next) => {
    console.log(req.user);
    try {
        // Find user role
        const userRole = await Role.findById(req.user.role);
        if (userRole == null) {
            return res.status(500).json({
                message: "Role not found",
            });
        }
        // Check if the user role admin
        if (userRole.rolename !== "admin") {
            return res.status(403).json({
                message: "User don't have permission",
            });
        }
        next();
    } catch (err) {
        console.error(err);
    }
};

const verifySale = async (req, res, next) => {
    console.log(req.user);
    try {
        // Find user role
        const userRole = await Role.findById(req.user.role);
        if (userRole == null) {
            return res.status(500).json({
                message: "Role not found",
            });
        }
        // Check if the user role admin
        if (userRole.rolename !== "sale") {
            return res.status(403).json({
                message: "User don't have permission",
            });
        }
        next();
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    verifyAdmin,
    verifySale,
};
