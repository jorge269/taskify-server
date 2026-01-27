const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true},
    age: { type: Number, required: true},
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);