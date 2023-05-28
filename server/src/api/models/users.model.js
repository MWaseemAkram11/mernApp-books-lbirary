const mongoose = require("mongoose");

/**
 * User Schema
 * @private
 */
const UserSchema = new mongoose.Schema(
  {
    type: { type: Number, default: 1 }, // 1 = User, 2 = Admin
    name: { type: String },
    email: { type: String },
    password: { type: String, required: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", UserSchema);
