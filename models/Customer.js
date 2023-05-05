const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CustomerSchema = new Schema(
    {
        phone: { type: String, require: true, unique: true },
        image: { type: String, require: false },
        name: { type: String, require: false },
        email: { type: String, require: false },
        birthday: { type: Date, require: false },
        company: { type: String, require: false },
        bankAccount: { type: String, require: false },
        address: { type: String, require: false },
        userId: { type: ObjectId, ref: "User" },
        updatedBy: { type: ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Customer", CustomerSchema);
