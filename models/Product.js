const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ProductSchema = new Schema(
    {
        productId: { type: String, require: true },
        cover: { type: String, require: true, default: null },
        images: { type: [String] },
        categoryId: { type: ObjectId, ref: "Category", require: true },
        customerId: { type: ObjectId, ref: "Customer", default: null },
        sellerId: { type: ObjectId, ref: "User", default: null },
        price: { type: Number, min: 0, default: 0 },
        deposit: { type: Number, min: 0, default: 0 },
        payment: { type: Number, min: 0, default: 0 },
        amount: { type: Number, min: 0, default: 0 },
        desc: { type: String },
        port: { type: String },
        document: { type: String },
        status: {
            type: String,
            enum: ["pending", "sold", "done"],
            default: "pending",
        },
        saleDate: { type: Date },
        arrivalDate: { type: Date },
        deliveryDate: { type: Date },
        updatedBy: { type: ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", ProductSchema);
