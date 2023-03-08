const Container = require("../models/Container");

const getAllContainer = async (req, res) => {
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort == "desc" ? -1 : 1;
    const startDate = req.query.startdate || new Date("1970-1-1");
    const endDate = req.query.enddate || new Date();

    console.log(startDate, endDate);

    try {
        // Get all containers
        const containers = await Container.find({
            date: { $gt: new Date(startDate), $lt: new Date(endDate) },
        })
            .select("-_id -accounts._id")
            .limit(limit)
            .sort({ id: sort });
        return res.status(200).json(containers);
    } catch (err) {
        console.error(err);
    }
};

const getContainer = async (req, res) => {
    try {
        // Get container by id
        const container = await Container.findOne({
            containerId: req.params.containerid,
        }).select("-_id -accounts._id");
        return res.status(200).json(container);
    } catch (err) {
        console.error(err);
    }
};

const getContByContainerId = async (req, res) => {
    const containerId = req.params.containerid;
    const startDate = req.query.startdate || new Date("1970-1-1");
    const endDate = req.query.enddate || new Date();

    console.log(startDate, endDate);

    try {
        // Get all containers
        const containers = await Container.find({
            containerId,
            date: { $gt: new Date(startDate), $lt: new Date(endDate) },
        }).select("-_id -accounts._id");
        return res.status(200).json(containers);
    } catch (err) {
        console.error(err);
    }
};

const getContByUserId = async (req, res) => {
    const userId = req.params.userid;
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort == "desc" ? -1 : 1;
    const startDate = req.query.startdate || new Date("1970-1-1");
    const endDate = req.query.enddate || new Date();

    console.log(startDate, endDate);

    try {
        // Get all containers
        const containers = await Container.find({
            userId,
            date: { $gt: new Date(startDate), $lt: new Date(endDate) },
        })
            .select("-_id -accounts._id")
            .limit(limit)
            .sort({ id: sort });
        return res.status(200).json(containers);
    } catch (err) {
        console.error(err);
    }
};

const getContByCustomerId = async (req, res) => {
    const containerId = req.params.containerid;
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort == "desc" ? -1 : 1;
    const startDate = req.query.startdate || new Date("1970-1-1");
    const endDate = req.query.enddate || new Date();

    console.log(startDate, endDate);

    try {
        // Get all containers
        const containers = await Container.find({
            containerId,
            date: { $gt: new Date(startDate), $lt: new Date(endDate) },
        })
            .select("-_id -accounts._id")
            .limit(limit)
            .sort({ id: sort });
        return res.status(200).json(containers);
    } catch (err) {
        console.error(err);
    }
};

const createContainer = async (req, res) => {
    if (req.body == undefined) {
        return res.status(400).json({
            status: "error",
            message: "data is undefined",
        });
    }

    if (req.body.containerid == null) {
        return res.status(400).json({ message: "Missing input" });
    }
    try {
        // Find if container already exists
        const containerExists = await Container.findOne({
            containerId: req.body.containerid,
        }).select("-_id -accounts._id");
        if (containerExists) {
            return res.status(500).json({
                message: "Container exists.",
            });
        }
        // If container not exists, create new container
        const newContainer = new Container({
            containerId: req.body.containerid,
            customer: {
                customerId: req.body.customerid,
                salers: req.body.salers,
                price: req.body.price,
                deposit: req.body.deposit,
            },
            infomation: {
                timeArrived: req.body.time_arrived,
                port: req.body.port,
                status: req.body.status,
                note: req.body.note,
            },
            modified: {
                modifiedAt: Date.now(),
                modifiedBy: req.body.userid,
            },
        });
        await newContainer.save();
        return res.status(201).json(newContainer);
    } catch (err) {
        console.error(err);
    }
};

const updateContainer = async (req, res) => {
    if (req.body == undefined || req.params.containerid == null) {
        res.status(400).json({
            status: "error",
            message: "something went wrong! check your sent data",
        });
    }
    console.log(req.params.containerid)

    try {
        // Find container and update
        await Container.findOneAndUpdate(
            { containerId: req.params.containerid },
            {
                $set: {
                    containerId: req.body.containerid,
                    customer: {
                        customerId: req.body.customerid,
                        salers: req.body.salers,
                        price: req.body.price,
                        deposit: req.body.deposit,
                    },
                    infomation: {
                        timeArrived: req.body.time_arrived,
                        port: req.body.port,
                        status: req.body.status,
                        note: req.body.note,
                    },
                    modified: {
                        modifiedAt: Date.now(),
                        modifiedBy: req.body.userid,
                    },
                },
            }
        );
        return res.status(202).json({ message: "Update successful" });
    } catch (err) {
        console.error(err);
    }
};

const deleteContainer = async (req, res) => {
    if (req.params.containerid == null) {
        res.status(400).json({
            status: "error",
            message: "id should be provided",
        });
    }
    try {
        // Find container and delete
        const container = await Container.findOneAndDelete({
            containerId: req.params.containerid,
        }).select("-_id -accounts._id");
        return res.status(200).json(container);
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    getAllContainer,
    getContainer,
    getContByContainerId,
    getContByUserId,
    getContByCustomerId,
    createContainer,
    updateContainer,
    deleteContainer,
};
