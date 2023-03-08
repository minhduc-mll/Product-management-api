const mongoose = require("mongoose");

const container = mongoose.Schema({
    containerId: {
        type: String,
        require: true,
        min: 11,
        max: 11,
    },
    customer: {
        customerId: {
            type: mongoose.Schema.Types.Number,
            ref: "Customer",
        },
        salers: {
            type: mongoose.Schema.Types.Number,
            ref: "Account",
        },
        price: {
            type: Number,
            min: 0,
            default: 0,
        },
        deposit: {
            type: Number,
            min: 0,
            default: 0,
        },
    },
    infomation: {
        timeArrived: {
            type: Date,
        },
        port: {
            type: String,
        },
        status: {
            type: String,
        },
        note: {
            type: String,
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

module.exports = mongoose.model("Container", container);
