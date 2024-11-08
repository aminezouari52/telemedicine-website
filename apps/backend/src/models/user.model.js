const mongoose = require("mongoose");
const validator = require("validator");
const { roles } = require("../config/roles");

const userSchema = new mongoose.Schema(
  {
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
    firstName: String,
    lastName: String,
    age: {
      type: Number,
      min: [18, "Age must be greater than 17"],
      max: [100, "Age cannot exceed 100"],
    },
    phone: {
      type: String,
      unique: true,
      match: [
        /^[0-9]*$/,
        "Please enter a valid phone number with an optional leading + sign.",
      ],
    },
    address: String,
    city: String,
    zip: {
      type: Number,
      match: [
        /^[0-9]+$/,
        "Please enter a valid zip code which contains only numbers",
      ],
      minlength: 5,
      maxlength: 5,
    },
    role: {
      type: String,
      enum: roles,
      required: true,
    },
  },
  { timestamps: true, discriminatorKey: "role", collection: "users" },
);

const User = mongoose.model("User", userSchema);

module.exports = User;

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
