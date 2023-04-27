const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CategorySchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        desc: { type: String, require: false },
        updatedBy: { type: ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Category", CategorySchema);
