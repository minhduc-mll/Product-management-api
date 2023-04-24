const Customer = require("../models/Customer");

const getAllCustomer = async (req, res) => {
    const q = req.query;
    const filters = {
        ...(q.phone && { phone: q.phone }),
        ...(q.name && { name: q.name }),
        ...((q.startDate || q.endDate) && {
            birthday: {
                ...(q.startDate && { $gt: q.startDate }),
                ...(q.endDate && { $lt: q.endDate }),
            },
        }),
        ...(q.search && {
            phone: { $regex: q.search, $options: "i" },
            name: { $regex: q.search, $options: "i" },
        }),
        ...(q.updateBy && { updateBy: q.updateBy }),
    };

    try {
        // Get all customers with filters
        const customers = await Customer.find(filters)
            .select({ __v: 0 })
            .limit(q.limit)
            .sort({ [q.sort]: 1, createdAt: -1 });
        if (!customers) {
            return res.status(404).json("Customer not found");
        }
        return res.status(200).json(customers);
    } catch (err) {
        console.error(err);
    }
};

const getCustomer = async (req, res) => {
    try {
        // Get customer by id
        const customer = await Customer.findOne({
            _id: req.params.id,
        }).select({ __v: 0 });
        if (!customer) {
            return res.status(404).json("Customer not found");
        }
        return res.status(200).json(customer);
    } catch (err) {
        console.error(err);
    }
};

const createCustomer = async (req, res) => {
    if (!req.body.phone) {
        return res.status(400).json({ message: "Missing input" });
    }
    try {
        // Find if customer already exists
        const customerExists = await Customer.findOne({
            phone: req.body.phone,
        });
        if (customerExists) {
            return res.status(409).json({
                message: "Phone number already exists.",
            });
        }
        // If customer not exist, add new customer
        const newCustomer = new Customer({
            updatedBy: req.userId,
            userId: req.userId,
            image: req.image,
            ...req.body,
        });
        await newCustomer.save();
        return res.status(201).json(newCustomer);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const updateCustomer = async (req, res) => {
    try {
        // Find if phone number already exists
        const customerExists = await Customer.findOne({
            phone: req.body.phone,
        });
        if (customerExists) {
            return res.status(409).json({
                message: "Phone number already exists.",
            });
        }
        // If phone number not exist, find customer and update
        await Customer.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    updatedBy: req.userId,
                    ...req.body,
                },
            }
        );
        return res.status(202).json("Update successful");
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const deleteCustomer = async (req, res) => {
    try {
        // Find customer and delete
        const customer = await Customer.findOneAndDelete({
            _id: req.params.id,
        });
        return res.status(200).json(customer);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const countCustomers = async (req, res) => {
    try {
        // Count all customer
        const count = await Customer.countDocuments().exec();
        return res.status(200).json(count);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

module.exports = {
    getAllCustomer,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    countCustomers,
};
