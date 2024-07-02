const User = require("../models/user");

exports.getRecommendations = async (req, res) => {
  try {
    // Retrieve user information from request
    const user = await User.findOne({ email: "ahmedmohsen@gmail.com" }).exec();

    // Pass user data to your recommendation model
    // // const recommendations = recommendationModel(userData);

    res.json({
      // recommendations
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to get recommendations");
  }
};
