const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const adminCheck = async (req, res, next) => {
  try {
    const dbUser = await User.findOne({ email: req.user.email }).exec();

    if (!dbUser || dbUser.role !== "admin") {
      throw new ApiError(httpStatus.FORBIDDEN, "Admin access required");
    }

    req.dbUser = dbUser;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = adminCheck;
