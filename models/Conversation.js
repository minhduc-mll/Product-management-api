const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ConversationSchema = new Schema(
    {
        id: { type: Number, required: true, unique: true },
        userOneId: { type: ObjectId, ref: "User", required: true },
        userTwoId: { type: ObjectId, ref: "User", require: true },
        readByUserOne: { type: Boolean, require: true },
        readByUserTwo: { type: Boolean, require: true },
        lastMessage: { type: String, require: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
