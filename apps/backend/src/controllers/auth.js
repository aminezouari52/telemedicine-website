const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  const { email } = req.user;
  const role = req.body.role;

  const user = await User.findOneAndUpdate(
    { email },
    { name: email.split("@")[0], role },
    { new: true }
  );
  if (user) {
    res.json(user);
  } else {
    const newUser = await new User({
      email,
      name: email.split("@")[0],
      role,
    }).save();
    res.json(newUser);
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();
    res.json(user);
  } catch (err) {
    throw new Error(err);
  }
};
