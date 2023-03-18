const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Customer = new Schema({
    id: { type: Number, required: true },
    zalo: { type: String, require: true },
    phone: { type: String, require: true },
    email: { type: String },
    company: { type: String },
    bankAccount: { type: String },
    name: {
        firstname: String,
        lastname: String,
    },
    birhtday: Date,
    address: {
        city: String,
        district: String,
        full: String,
        zipcode: String,
        geolocation: {
            lat: String,
            lon: String,
        },
    },
    createdAt: { type: Date, default: Date.now },
    modified: [
        {
            modifiedAt: { type: Date, default: Date.now },
            modifiedBy: { type: ObjectId, ref: "User" },
        },
    ],
});

module.exports = mongoose.model("Customer", Customer);
