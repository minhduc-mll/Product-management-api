const Role = require("../models/Role");

const getAllRole = async (req, res) => {
    const limit = Number(req.body.limit) || 0;
    const sort = req.body.sort == "desc" ? -1 : 1;

    try {
        // Get all roles
        const roles = await Role.find()
            .select({ _id: 0, __v: 0 })
            .limit(limit)
            .sort({ id: sort });
        return res.status(200).json(roles);
    } catch (err) {
        console.error(err);
    }
};

const getRole = async (req, res) => {
    try {
        // Get role by id
        const role = await Role.findOne({
            _id: req.params.id,
        }).select({ _id: 0, __v: 0 });
        return res.status(200).json(role);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const createRole = async (req, res) => {
    const { rolename } = req.body;
    if (!rolename) {
        return res.status(400).json("Missing input");
    }
    try {
        // Find if role already exists
        const roleExists = await Role.findOne({
            rolename: rolename,
        });
        if (roleExists) {
            return res.status(400).json("Role already exists.");
        }
        // If role not exist, create new role
        Role.find().countDocuments(async function (err, count) {
            if (err) {
                return res.status(500).json(err.message);
            }
            const newRole = new Role({
                id: count + 1,
                rolename: rolename,
            });
            await newRole.save();
            return res.status(201).json(newRole);
        });
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const updateRole = async (req, res) => {
    try {
        // Find if rolename already exists
        const roleExists = await Role.findOne({
            rolename: req.body.rolename,
        });
        if (roleExists) {
            return res.status(400).json("Rolename already exists.");
        }
        // If rolename not exist, find role and update
        await Role.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    rolename: req.body.rolename,
                },
            }
        );
        return res.status(202).json("Update successful");
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const deleteRole = async (req, res) => {
    try {
        // Find role and delete
        const role = await Role.findOneAndDelete({
            _id: req.params.id,
        });
        return res.status(200).json(role);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

module.exports = {
    getAllRole,
    getRole,
    createRole,
    updateRole,
    deleteRole,
};
