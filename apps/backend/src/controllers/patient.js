const Consultation = require("../models/consultation");

exports.submitConsultation = async (req, res) => {
  try {
    res.json(await new Consultation(req.body).save());
  } catch (err) {
    res.status(400).send("Create category failed");
  }
};
