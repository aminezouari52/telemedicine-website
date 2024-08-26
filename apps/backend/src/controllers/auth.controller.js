const { User } = require("../models");
const { authService } = require("../services");

const createOrUpdateUser = async (req, res, next) => {
  const { email } = req.user;
  const role = req.body.role;

  try {
    const user = await authService.createOrUpdateUser(email, role);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();
    res.json(user);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createOrUpdateUser,
  currentUser,
};
