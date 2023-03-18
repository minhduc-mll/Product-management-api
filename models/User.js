const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const User = new Schema({
    id: { type: Number, required: true },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    name: {
        firstname: { type: String, require: true },
        lastname: { type: String, require: true },
    },
    phone: { type: String, require: true },
    email: { type: String, require: true },
    role: { type: ObjectId, ref: "Role", require: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", User);
