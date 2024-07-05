const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      default: "user",
    },
    phone: String,
  },
  { timestamps: true, discriminatorKey: "role", collection: "users" }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
