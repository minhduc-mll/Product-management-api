const mongoose = require("mongoose");

const account = mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        require: true,
        unique: true,
        min: 3,
        max: 50,
    },
    password: {
        type: String,
        require: true,
        max: 50,
    },
    name: {
        firstname: {
            type: String,
            require: true,
        },
        lastname: {
            type: String,
            require: true,
        },
    },
    phone: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Account", account);
