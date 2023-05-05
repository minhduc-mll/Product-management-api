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
            $or: [
                {
                    phone: { $regex: q.search, $options: "i" },
                },
                {
                    name: { $regex: q.search, $options: "i" },
                },
            ],
        }),
        ...(q.updateBy && { updateBy: q.updateBy }),
    };

    const dsc = q.sortOrder === "dsc" ? -1 : 1;

    try {
        // Get all customers with filters
        const customers = await Customer.find(filters)
            .select({ __v: 0 })
            .limit(q.limit)
            .sort({ [q.sortName]: dsc })
            .exec();
        return res.status(200).json(customers);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getCustomersBySellerId = async (req, res) => {
    const sellerId = req.params.sellerId;
    const q = req.query;
    const dsc = q.sortOrder === "dsc" ? -1 : 1;
    try {
        // Get customers by seller id
        const customers = await Customer.find({
            userId: sellerId,
        })
            .select({ __v: 0 })
            .limit(q.limit)
            .sort({ [q.sortName]: dsc, createdAt: -1 })
            .exec();
        return res.status(200).json(customers);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getCustomer = async (req, res) => {
    const customerId = req.params.id;
    try {
        // Get customer by id
        const customer = await Customer.findOne({
            _id: customerId,
        })
            .select({ __v: 0 })
            .exec();
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        return res.status(200).json(customer);
    } catch (err) {
        return res.status(500).json(err.message);
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
        }).exec();
        if (customerExists) {
            return res.status(409).json({
                message: "Phone number already exists.",
            });
        }
        // If customer not exist, create new customer
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
    const customerId = req.params.id;
    try {
        // Find if phone number already exists
        const customerExists = await Customer.findOne({
            phone: req.body.phone,
        }).exec();
        if (customerExists && customerExists._id != customerId) {
            return res.status(409).json({
                message: "Phone number already exists.",
            });
        }
        // If phone number not exist, find customer and update
        await Customer.findOneAndUpdate(
            { _id: customerId },
            {
                $set: {
                    updatedBy: req.userId,
                    image: req.image,
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
    const customerId = req.params.id;
    try {
        // Find customer and delete
        const customer = await Customer.findOneAndDelete({
            _id: customerId,
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
    getCustomersBySellerId,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    countCustomers,
};
