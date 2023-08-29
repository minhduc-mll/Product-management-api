const Task = require("../models/Task");

const getAllTask = async (req, res) => {
    const q = req.query;
    const filters = {
        ...(q.title && { title: q.title }),
        ...(q.desc && { desc: q.desc }),
        ...(q.status && { status: q.status }),
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };

    const dsc = q.sortOrder === "dsc" ? -1 : 1;

    try {
        // Get all tasks with filters
        const tasks = await Task.find(filters)
            .select({ __v: 0 })
            .limit(q.limit)
            .sort({ createdAt: -1, [q.sortName]: dsc })
            .exec();
        return res.status(200).json(tasks);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getTask = async (req, res) => {
    const taskId = req.params.id;
    try {
        // Get task by id
        const task = await Task.findOne({
            _id: taskId,
        })
            .select({ __v: 0, password: 0 })
            .exec();
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(task);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getTaskByUserId = async (req, res) => {
    const userId = req.params.userId;
    const q = req.query;
    const dsc = q.sortOrder === "dsc" ? -1 : 1;
    try {
        // Get task by user id
        const task = await Task.find({
            userId: userId,
        })
            .select({ __v: 0 })
            .limit(q.limit)
            .sort({ createdAt: -1, [q.sortName]: dsc })
            .exec();
        return res.status(200).json(task);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const createTask = async (req, res) => {
    if (!req.body.userId || !req.body.title) {
        return res.status(400).json({ message: "Missing input" });
    }
    try {
        // Find if task already exists
        const taskExists = await Task.findOne({
            title: req.body.title,
        });
        if (taskExists) {
            return res.status(409).json({
                message: "Task exists.",
            });
        }
        // Create new task
        const newTask = new Task({
            updatedBy: req.userId,
            ...req.body,
        });
        await newTask.save();
        return res.status(201).json(newTask);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const updateTask = async (req, res) => {
    const taskId = req.params.id;
    try {
        // Find task and update
        await Task.findOneAndUpdate(
            { _id: taskId },
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

const deleteTask = async (req, res) => {
    const taskId = req.params.id;
    try {
        // Find task and delete
        const task = await Task.findOneAndDelete({
            _id: taskId,
        });
        return res.status(200).json(task);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

const getUserTasks = async (req, res) => {
    try {
        // Get all tasks
        const tasks = await Task.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            { $arrayElemAt: ["$user", 0] },
                            "$$ROOT",
                        ],
                    },
                },
            },
            {
                $project: {
                    userId: 1,
                    username: 1,
                    name: 1,
                    title: 1,
                    desc: 1,
                },
            },
        ]).exec();

        // Add task to cards of column with unique title as username
        const userTaskColumn = { columns: [] };
        tasks.forEach((item) => {
            let existing = userTaskColumn.columns.filter((value, index) => {
                return value.title == item.name;
            });

            if (existing.length) {
                let existingIndex = userTaskColumn.columns.indexOf(existing[0]);
                userTaskColumn.columns[existingIndex].cards.push({
                    id: item._id,
                    title: item.title,
                    desc: item.desc,
                });
            } else {
                const column = {
                    id: item.userId,
                    title: item.name,
                    cards: [
                        {
                            id: item._id,
                            title: item.title,
                            desc: item.desc,
                        },
                    ],
                };
                userTaskColumn.columns.push(column);
            }
        });
        return res.status(200).json(userTaskColumn);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

module.exports = {
    getAllTask,
    getTask,
    getTaskByUserId,
    createTask,
    updateTask,
    deleteTask,
    getUserTasks,
};
