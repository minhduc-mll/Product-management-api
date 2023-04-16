const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const EventSchema = new Schema(
    {
        title: { type: String, require: true },
        allDay: { type: Boolean, default: false },
        start: { type: Date, require: true },
        end: { type: Date, require: false },
        status: { type: String, require: false },
        backgroundColor: { type: String, require: false },
        borderColor: { type: String, require: false },
        updatedBy: { type: ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Event", EventSchema);
