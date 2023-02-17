const Account = require("../models/Account");

const getAllAccount = async (req, res) => {
    try {
        // Get all accounts
        const accounts = await Account.find();
        return res.status(200).json(accounts);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getAccount = async (req, res) => {
    try {
        // Get account by id
        const account = await Account.findById(req.params.id);
        return res.status(200).json(account);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const createAccount = async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: "Missing input" });
    }
    try {
        // Find if account already exists
        const accountExists = await Account.findOne({ email: email });
        if (accountExists) {
            return res.status(500).json({
                message: "User already exist with this email account.",
            });
        }
        // If account not exist, create new account
        const newAccount = new Account({
            username: username,
            email: email,
            password: password,
            role: role,
        });
        await newAccount.save();
        return res.status(201).json(newAccount);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateAccount = async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: "Missing input" });
    }
    try {
        // Find account and update
        await Account.findByIdAndUpdate(req.params.id, {
            $set: {
                username,
                email,
                password,
                role,
            },
        });
        return res.status(202).json({ message: "Update successful" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        // Find account and delete
        const account = await Account.findByIdAndDelete(req.params.id);
        return res.status(200).json(account);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllAccount,
    getAccount,
    createAccount,
    updateAccount,
    deleteAccount,
};
