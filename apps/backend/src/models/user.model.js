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

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
