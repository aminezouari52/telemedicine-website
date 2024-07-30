const mongoose = require("mongoose");
const validator = require("validator");
const { roles } = require("../config/roles");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\+?[1-9]\d{1,14}$/,
        "Please enter a valid phone number with an optional leading + sign.",
      ],
    },
  },
  { timestamps: true, discriminatorKey: "role", collection: "users" },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
