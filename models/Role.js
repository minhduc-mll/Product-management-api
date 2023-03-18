const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Role = new Schema({
    id: { type: Number, required: true },
    rolename: { type: String, require: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Role", Role);
