const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const TaskSchema = new Schema(
    {
        userId: { type: ObjectId, ref: "User", require: false },
        title: { type: String, require: true },
        desc: { type: String, require: false },
        status: {
            type: String,
            enum: ["pending", "done"],
            default: "pending",
        },
        updatedBy: { type: ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Task", TaskSchema);
