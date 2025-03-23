const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    comments: [{ type: String }],
    files: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
