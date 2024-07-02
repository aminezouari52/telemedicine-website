const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const reservationSchema = new mongoose.Schema({
  reservation: {
    type: ObjectId,
    ref: "Reservation",
  },
  date: String,
  time: String,
  firstName: String,
  lastName: String,
  address: String,
  phone: String,
  age: String,
  weight: String,
  type: String,
  dateInsurance: String,
  provider: String,
  police: String,
  doctor: String,
});

module.exports = mongoose.model("Reservation", reservationSchema);
