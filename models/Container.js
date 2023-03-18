const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Container = new Schema({
    containerId: { type: String, require: true },
    customer: {
        customerId: { type: ObjectId, ref: "Customer" },
        salers: { type: ObjectId, ref: "User" },
        price: { type: Number, min: 0, default: 0 },
        deposit: { type: Number, min: 0, default: 0 },
    },
    infomation: {
        timeArrived: { type: Date },
        port: { type: String },
        status: { type: String },
        note: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
    modified: [
        {
            modifiedAt: { type: Date, default: Date.now },
            modifiedBy: { type: ObjectId, ref: "User" },
        },
    ],
});

module.exports = mongoose.model("Container", Container);
