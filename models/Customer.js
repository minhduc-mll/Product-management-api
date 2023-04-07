const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CustomerSchema = new Schema(
    {
        phone: { type: String, require: true, unique: true },
        image: { type: String, require: false },
        name: { type: String, require: false },
        email: { type: String, require: false },
        birhtday: { type: Date, require: false },
        company: { type: String, require: false },
        bankAccount: { type: String, require: false },
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
        updatedBy: { type: ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Customer", CustomerSchema);
