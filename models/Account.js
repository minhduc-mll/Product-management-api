const mongoose = require("mongoose");

const account = mongoose.Schema({
    username: String,
    email: String,
    password: String,
	role: String,
});

module.exports = mongoose.model("Account", account);
