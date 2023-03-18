const Customer = require("../models/Customer");

const getAllCustomer = async (req, res) => {
    const limit = Number(req.body.limit) || 0;
    const sort = req.body.sort == "desc" ? -1 : 1;

    try {
        // Get all customers
        const customers = await Customer.find()
            .select({ _id: -1, __v: -1 })
            .limit(limit)
            .sort({ id: sort });
        return res.status(200).json(customers);
    } catch (err) {
        console.error(err);
    }
};

const getCustomer = async (req, res) => {
    if (req.params.id == null) {
        return res.status(400).json({
            status: "error",
            message: "id should be provided",
        });
    }

    try {
        // Get customer by id
        const customer = await Customer.findOne({
            id: req.params.id,
        }).select({ _id: -1, __v: -1 });
        return res.status(200).json(customer);
    } catch (err) {
        console.error(err);
    }
};

const getCustomerByUserId = async (req, res) => {
    if (req.params.userId == null) {
        return res.status(400).json({
            status: "error",
            message: "id should be provided",
        });
    }

    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort == "desc" ? -1 : 1;

    try {
        // Get customers by user id
        const customers = await Customer.find({ userId: req.params.userId })
            .select({ _id: -1, __v: -1 })
            .limit(limit)
            .sort({ id: sort });
        return res.status(200).json(customers);
    } catch (err) {
        console.error(err);
    }
};

const createCustomer = async (req, res) => {
    if (typeof req.body == "undefined") {
        return res.status(400).json({
            status: "error",
            message: "data is undefined",
        });
    }

    try {
        if (req.body.phone == null) {
            return res.status(400).json({ message: "Missing input" });
        }
        // Find if customer already exists
        const customerExists = await Customer.findOne({
            phone: req.body.phone,
        });
        if (customerExists) {
            return res.status(500).json({
                message: "Phone number already exists.",
            });
        }
        // If customer not exist, add new customer
        await Customer.find().countDocuments(function (err, count) {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: err,
                });
            }
            const newCustomer = new Customer({
                id: count + 1,
                zalo: req.body.zalo,
                phone: req.body.phone,
                email: req.body.email,
                company: req.body.company,
                bankAccount: req.body.bankaccount,
                name: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                },
                birthday: req.body.birthday,
                address: {
                    city: req.body.city,
                    district: req.body.district,
                    full: req.body.full,
                    zipcode: req.body.zipcode,
                    geolocation: {
                        lat: req.body.lat,
                        lon: req.body.lon,
                    },
                },
                modified: {
                    modifiedAt: Date.now(),
                    modifiedBy: req.user,
                },
            });
            newCustomer.save();
            return res.status(201).json(newCustomer);
        });
    } catch (err) {
        console.error(err);
    }
};

const updateCustomer = async (req, res) => {
    if (typeof req.body == "undefined" || req.params.id == null) {
        return res.status(400).json({
            status: "error",
            message: "something went wrong! check your sent data",
        });
    }

    try {
        // Find if phone number already exists
        const customerExists = await Customer.findOne({
            phone: req.body.phone,
        });
        if (customerExists) {
            return res.status(500).json({
                message: "Phone number already exists.",
            });
        }
        // If phone number not exist, find customer and update
        await Customer.findOneAndUpdate(
            { id: req.params.id },
            {
                $set: {
                    zalo: req.body.zalo,
                    phone: req.body.phone,
                    email: req.body.email,
                    company: req.body.company,
                    bankAccount: req.body.bankaccount,
                    name: {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                    },
                    birthday: req.body.birthday,
                    address: {
                        city: req.body.city,
                        district: req.body.district,
                        full: req.body.full,
                        zipcode: req.body.zipcode,
                        geolocation: {
                            lat: req.body.lat,
                            lon: req.body.lon,
                        },
                    },
                    modified: {
                        modifiedAt: Date.now(),
                        modifiedBy: req.user,
                    },
                },
            }
        );
        return res.status(202).json({ message: "Update successful" });
    } catch (err) {
        console.error(err);
    }
};

const deleteCustomer = async (req, res) => {
    if (req.params.id == null) {
        return res.status(400).json({
            status: "error",
            message: "id should be provided",
        });
    }
    try {
        // Find customer and delete
        const customer = await Customer.findOneAndDelete({
            id: req.params.id,
        });
        return res.status(200).json(customer);
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    getAllCustomer,
    getCustomer,
    getCustomerByUserId,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};
