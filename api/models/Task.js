const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String},
    date: { type: Date, required: true},
    status: {type: String, enum: ['done', 'doing', 'to do'], default: 'to do'}, },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);