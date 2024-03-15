const mongoose = require("mongoose");

const studentScheme = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    isRep: { type: Boolean, required: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    everExpelled: { type: String, required: false },
  },
  { timeStamps: true }
);

const Student = mongoose.model("Student", studentScheme);

module.exports = Student;
