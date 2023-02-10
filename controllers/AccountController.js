const Account = require("../models/Account");

const getAllAccount = async (req, res) => {
    const accounts = await Account.find();
    return res.status(200).send(accounts);
};

const getAccount = async (req, res) => {
    const account = await Account.findById(req.params.id);
    return res.status(200).send(account);
};

const createAccount = async (req, res) => {
    const { username, email, password, role } = req.body;
    const accountExists = await Account.findOne({ email: email });
    if (accountExists) {
        return res
            .status(500)
            .send({ message: "User already exist with this email account." });
    }
    try {
        const newAccount = new Account({
            username: username,
            email: email,
            password: password,
            role: role,
        });
        await newAccount.save();
        return res.status(201).send(newAccount);
    } catch (error) {
        return res
            .status(500)
            .send({ message: "User already exist with this email account." });
    }
};

const updateAccount = async (req, res) => {
    const { username, email, password, role } = req.body;
    const account = await Account.findByIdAndUpdate(req.params.id, {
        $set: {
            username,
            email,
            password,
            role,
        },
    });
    return res.status(202).send(account);
};

const deleteAccount = async (req, res) => {
    const account = await Account.findByIdAndDelete(req.params.id);
    return res.status(200).send(account);
};

module.exports = {
    getAllAccount,
    getAccount,
    createAccount,
    updateAccount,
    deleteAccount,
};
