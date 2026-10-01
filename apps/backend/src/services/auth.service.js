const { User } = require("../models");
const { clerkClient } = require("../clerk");

// Roles a user may pick for themselves at sign-up. The choice travels in
// Clerk's `unsafeMetadata`, which the browser can write, so it is never
// trusted for anything beyond this list — admins are only ever seeded.
const SELF_SERVICE_ROLES = ["patient", "doctor"];
const DEFAULT_ROLE = "patient";

const DUPLICATE_KEY_ERROR = 11000;

/**
 * Returns the MongoDB user for a signed-in Clerk user, creating it on their
 * first sign-in with the role they chose on the sign-up form.
 */
const loginUser = async ({ uid, email }) => {
  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) return existingUser;

  const clerkUser = await clerkClient.users.getUser(uid);
  const requestedRole = clerkUser.unsafeMetadata?.role;
  const role = SELF_SERVICE_ROLES.includes(requestedRole)
    ? requestedRole
    : DEFAULT_ROLE;

  try {
    return await User.create({ email, role });
  } catch (err) {
    // A concurrent first request already created the user.
    if (err.code === DUPLICATE_KEY_ERROR) {
      return User.findOne({ email }).exec();
    }
    throw err;
  }
};

const getCurrentUser = async (email) => {
  const user = await User.findOne({ email }).exec();
  return user;
};

module.exports = {
  loginUser,
  getCurrentUser,
};
