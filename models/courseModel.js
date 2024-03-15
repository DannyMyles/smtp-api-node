const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    courseId: { type: String, unique: true, required: true },
    duration: { type: Number, required: true },
    username: { type: String, required: true },
    instructor: { type: String, required: true },
    startDate: { type: Date },
    end: { type: Date},
    fee: { type: Number, required: true },
    file:{type: String }
  },
  { timeStamps: true }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
