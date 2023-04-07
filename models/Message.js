const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const MessageSchema = new Schema(
    {
        id: { type: Number, required: true, unique: true },
        conversationId: { type: ObjectId, ref: "Conversation", required: true },
        userId: { type: ObjectId, ref: "User", required: true },
        desc: { type: String, require: true, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Message", MessageSchema);
