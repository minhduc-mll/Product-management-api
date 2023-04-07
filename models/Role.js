const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = new Schema(
    {
        id: { type: Number, required: true, unique: true },
        rolename: { type: String, require: true, unique: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Role", RoleSchema);
