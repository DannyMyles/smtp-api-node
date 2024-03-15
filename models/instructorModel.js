const mongoose = require("mongoose");

const instructorSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    isPrincipal: { type: Boolean, required: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timeStamps: true }
);

const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;
