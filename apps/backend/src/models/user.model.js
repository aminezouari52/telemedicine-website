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
    role: {
      type: String,
      enum: roles,
      default: "user",
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
