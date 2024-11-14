const admin = require("../firebase");
const httpStatus = require("http-status");
const ApiError = require("../ApiError");

const authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);

    if (!firebaseUser) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
    }

    req.user = firebaseUser;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authCheck;
