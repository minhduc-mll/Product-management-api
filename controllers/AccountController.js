const Account = require("../models/Account");

const getAllAccount = async (req, res) => {
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort == "desc" ? -1 : 1;

    try {
        // Get all accounts
        const accounts = await Account.find()
            .select(["-_id"])
            .limit(limit)
            .sort({ id: sort });
        return res.status(200).json(accounts);
    } catch (err) {
        console.error(err);
    }
};

const getAccount = async (req, res) => {
    try {
        // Get account by id
        const account = await Account.findOne({
            id: req.params.id,
        }).select(["-_id"]);
        return res.status(200).json(account);
    } catch (err) {
        console.error(err);
    }
};

const createAccount = async (req, res) => {
    if (req.body == undefined) {
        return res.status(400).json({
            status: "error",
            message: "data is undefined",
        });
    }

    const { username, password, firstname, lastname, email, phone, role } =
        req.body;
    if (!username || !password || !role) {
        return res
            .status(400)
            .json({ status: "error", message: "Missing input" });
    }
    try {
        // Find if account already exists
        const accountExists = await Account.findOne({
            username: username,
        }).select(["-_id"]);
        if (accountExists) {
            return res.status(500).json({
                message: "Account already exists.",
            });
        }
        // If account not exist, create new account
        await Account.find().countDocuments(function (err, count) {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: err,
                });
            }
            const newAccount = new Account({
                id: count + 1,
                username: username,
                password: password,
                name: {
                    firstname: firstname,
                    lastname: lastname,
                },
                email: email,
                phone: phone,
                role: role,
            });
            newAccount.save();
            return res.status(201).json(newAccount);
        });
    } catch (err) {
        console.error(err);
    }
};

const updateAccount = async (req, res) => {
    if (req.body == undefined || req.params.id == null) {
        res.status(400).json({
            status: "error",
            message: "something went wrong! check your sent data",
        });
    }

    const { username, password, firstname, lastname, email, phone, role } =
        req.body;
    try {
        // Find if username already exists
        const accountExists = await Account.findOne({
            username: username,
        }).select(["-_id"]);
        if (accountExists) {
            return res
                .status(500)
                .json({ status: "error", message: "Username already exists." });
        }
        // If username not exist, find account and update
        await Account.findOneAndUpdate(
            { id: req.params.id },
            {
                $set: {
                    username,
                    password,
                    firstname,
                    lastname,
                    email,
                    phone,
                    role,
                },
            }
        ).select(["-_id"]);
        return res.status(202).json({ message: "Update successful" });
    } catch (err) {
        console.error(err);
    }
};

const deleteAccount = async (req, res) => {
    if (req.params.id == null) {
        res.status(400).json({
            status: "error",
            message: "id should be provided",
        });
    }

    try {
        // Find account and delete
        const account = await Account.findOneAndDelete({
            id: req.params.id,
        }).select(["-_id"]);
        return res.status(200).json(account);
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    getAllAccount,
    getAccount,
    createAccount,
    updateAccount,
    deleteAccount,
};
