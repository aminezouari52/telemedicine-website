const Doctor = require("../models/doctor");

exports.createDoctor = async (req, res) => {
  try {
    res.json(await new Doctor(req.body).save());
  } catch (err) {
    res.status(400).send("Create category failed");
  }
};
