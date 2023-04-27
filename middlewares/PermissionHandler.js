const verifySale = async (req, res, next) => {
    try {
        // Check the user role
        if (req.role !== "sale") {
            return res.status(403).json({
                message: "User don't have permission!",
            });
        }
        next();
    } catch (err) {
        return res.status(500).json("Something went wrong!");
    }
};

const verifyManager = async (req, res, next) => {
    try {
        // Check the user role
        if (req.role !== "manager") {
            return res.status(403).json({
                message: "User don't have permission!",
            });
        }
        next();
    } catch (err) {
        return res.status(500).json("Something went wrong!");
    }
};

const verifyMod = async (req, res, next) => {
    try {
        // Check the user role
        if (req.role !== "mod") {
            return res.status(403).json({
                message: "User don't have permission!",
            });
        }
        next();
    } catch (err) {
        return res.status(500).json("Something went wrong!");
    }
};

const verifyAdmin = async (req, res, next) => {
    try {
        // Check the user role
        if (req.role !== "admin" && req.role !== "mod" && req.role !== "dev") {
            return res.status(403).json({
                message: "User don't have permission!",
            });
        }
        next();
    } catch (err) {
        return res.status(500).json("Something went wrong!");
    }
};

module.exports = {
    verifySale,
    verifyManager,
    verifyMod,
    verifyAdmin,
};
