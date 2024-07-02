const Reservation = require("../models/reservation");

exports.submitReservation = async (req, res) => {
  try {
    res.json(await new Reservation(req.body).save());
  } catch (err) {
    res.status(400).send("Create category failed");
  }
};
