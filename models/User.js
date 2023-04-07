const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema(
    {
        id: { type: Number, required: true, unique: true },
        username: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        image: { type: String, require: false },
        name: { type: String, require: false },
        phone: { type: String, require: false },
        email: { type: String, require: false },
        birthday: { type: Date, require: false },
        role: {
            type: String,
            require: true,
            enum: ["sale", "manager", "mod", "admin"],
            default: "sale",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);
