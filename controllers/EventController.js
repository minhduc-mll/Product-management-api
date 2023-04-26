const Event = require("../models/Event");
const Product = require("../models/Product");

const getAllEvent = async (req, res) => {
    const q = req.query;
    const filters = {
        ...(q.title && { title: q.title }),
        ...(q.allDay && { allDay: q.allDay }),
        ...((q.startDate || q.endDate) && {
            start: {
                ...(q.startDate && { $gt: q.startDate }),
                ...(q.endDate && { $lt: q.endDate }),
            },
        }),
        ...(q.status && { status: q.status }),
        ...(q.backgroundColor && { backgroundColor: q.backgroundColor }),
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };

    const dsc = q.sortOrder === "dsc" ? -1 : 1;

    try {
        // Get all events with filters
        const events = await Event.find(filters)
            .select({ __v: 0 })
            .limit(q.limit)
            .sort({ createdAt: -1, [q.sortName]: dsc })
            .exec();
        return res.status(200).json(events);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getEvent = async (req, res) => {
    const eventId = req.params.id;
    try {
        // Get event by id
        const event = await Event.findOne({
            _id: eventId,
        })
            .select({ __v: 0, password: 0 })
            .exec();
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json(event);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const createEvent = async (req, res) => {
    if (!req.body.title || !req.body.start) {
        return res.status(400).json({ message: "Missing input" });
    }
    try {
        // Create new event
        const newEvent = new Event({
            updatedBy: req.userId,
            ...req.body,
        });
        await newEvent.save();
        return res.status(201).json(newEvent);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const updateEvent = async (req, res) => {
    const eventId = req.params.id;
    try {
        // Find event and update
        await Event.findOneAndUpdate(
            { _id: eventId },
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

const deleteEvent = async (req, res) => {
    const eventId = req.params.id;
    try {
        // Find event and delete
        const event = await Event.findOneAndDelete({
            _id: eventId,
        });
        return res.status(200).json(event);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProductEvents = async (req, res) => {
    try {
        // Get products have arrival events and delivery events
        const arrivalProducts = await Product.find({
            arrivalDate: { $ne: null },
        })
            .select({ _id: 1, productId: 1, arrivalDate: 1 })
            .exec();
        const deliveryProducts = await Product.find({
            deliveryDate: { $ne: null },
        })
            .select({ _id: 1, productId: 1, deliveryDate: 1 })
            .exec();

        let events = [];
        events.push(
            ...arrivalProducts?.map((product) => {
                return {
                    title: product.productId,
                    allDay: true,
                    start: product.arrivalDate,
                };
            }),
            ...deliveryProducts?.map((product) => {
                return {
                    title: product.productId,
                    allDay: true,
                    start: product.deliveryDate,
                    backgroundColor: "dodgerblue",
                    borderColor: "dodgerblue",
                };
            })
        );
        return res.status(200).json(events);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProductEventByProductId = async (req, res) => {
    const productId = req.params.productId;
    try {
        // Get product have arrival events with product id
        const product = await Product.findOne({
            productId: productId,
        })
            .select({ _id: 1, productId: 1, arrivalDate: 1, deliveryDate: 1 })
            .exec();
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let events = [];
        if (product?.arrivalDate) {
            events.push({
                title: product?.productId,
                allDay: true,
                start: product?.arrivalDate,
            });
        }
        if (product?.deliveryDate) {
            events.push({
                title: product?.productId,
                allDay: true,
                start: product?.deliveryDate,
                backgroundColor: "dodgerblue",
                borderColor: "dodgerblue",
            });
        }
        return res.status(200).json(events);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProductArrivalEvents = async (req, res) => {
    try {
        // Get products have arrival events and delivery events
        const arrivalProducts = await Product.find({
            arrivalDate: { $ne: null },
        })
            .select({ _id: 1, productId: 1, arrivalDate: 1 })
            .exec();

        let events = [];
        events.push(
            ...arrivalProducts?.map((product) => {
                return {
                    title: product.productId,
                    allDay: true,
                    start: product.arrivalDate,
                };
            })
        );
        return res.status(200).json(events);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getProductArrivalEventByProductId = async (req, res) => {
    const productId = req.params.productId;
    try {
        // Get product have arrival events with product id
        const product = await Product.findOne({
            productId: productId,
        })
            .select({ _id: 1, productId: 1, arrivalDate: 1 })
            .exec();
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let events = [];
        if (product?.arrivalDate) {
            events.push({
                title: product?.productId,
                allDay: true,
                start: product?.arrivalDate,
            });
        }
        return res.status(200).json(events);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

module.exports = {
    getAllEvent,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getProductEvents,
    getProductEventByProductId,
    getProductArrivalEvents,
    getProductArrivalEventByProductId,
};
