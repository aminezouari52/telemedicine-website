const { User } = require("../models");

const createOrUpdateUser = async (email, role) => {
  const user = await User.findOneAndUpdate(
    { email },
    { role },
    { new: true },
  ).exec();

  if (!user) {
    return await User.create({
      email,
      role,
    });
  }
  return user;
};

const getCurrentUser = async (email) => {
  const user = await User.findOne({ email }).exec();
  return user;
};

module.exports = {
  createOrUpdateUser,
  getCurrentUser,
};
