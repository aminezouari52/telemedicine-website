const { User } = require("../models");

const createOrUpdateUser = async (email, role) => {
  const user = await User.findOneAndUpdate({ email }, { role }, { new: true });
  if (user) {
    return user;
  } else {
    const newUser = await new User({
      email,
      role,
    }).save();
    return newUser;
  }
};

module.exports = {
  createOrUpdateUser,
};
