const mongoose = require("mongoose");

const customer = mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    zalo: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,
    },
    email: {
        type: String,
    },
    company: {
        type: String,
    },
    bankAccount: {
        type: String,
    },
    name: {
        firstname: {
            type: String,
        },
        lastname: {
            type: String,
        },
    },
    birhtday: {
        type: Date,
    },
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modified: [{
        modifiedAt: {
            type: Date,
            default: Date.now,
        },
        modifiedBy: {
            type: mongoose.Schema.Types.Number,
            ref: "Account",
        }
    }],
});

module.exports = mongoose.model("Customer", customer);
