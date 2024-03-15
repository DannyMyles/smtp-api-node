const Student = require("../models/studentModel");
const asyncWrapper = require("../middleware/asyncWrapper");
const HTTP_STATUS_CODES = require("../utils/statusCodes");

const createStudent = asyncWrapper(async (req, res) => {
  const {
    username,
    email,
    phone,
    gender,
    isRep,
    fullName,
    password,
    firstName,
    lastName,
    everExpelled,
  } = req.body;
  const student = new Student({
    username,
    email,
    phone,
    gender,
    isRep,
    fullName,
    password,
    firstName,
    lastName,
    everExpelled,
  });
  const saveStudent = await student.save();
  res.status(HTTP_STATUS_CODES.CREATED).json({ saveStudent });
});

const getStudents = asyncWrapper(async (req, res) => {
  const students = await Student.find({}).sort({ createdAt: -1 });

  if (!students) {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
  }
  res.status(HTTP_STATUS_CODES.OK).json({ students });
});

const getSingleStudent = asyncWrapper(async (req, res) => {
  const studentsId = req.params.id;
  const student = await Student.findById(studentsId);

  if (!student) {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
  }
  res.status(HTTP_STATUS_CODES.OK).json({ student });
});

// Put request
const updateStudent = asyncWrapper(async (req, res) => {
  const studentsId = req.params.id;
  const { studentsData } = req.body;

  try {
    const student = await Student.findByIdAndUpdate(studentsId, studentsData, {
      new: true,
    });

    if (!student) {
      res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
    }

    res.status(HTTP_STATUS_CODES.OK).json({ student });
  } catch (error) {
    console.log("Error occured", error);
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error });
  }
});

// Patch Request(Partially Update the student)
const partiallyUpdateStudent = asyncWrapper(async (req, res) => {
  const studentsId = req.params.id;
  const { studentsData } = req.body;

  try {
    const student = await Student.findByIdAndUpdate(
      studentsId,
      { $set: studentsData },
      { new: true }
    );

    if (!student) {
      res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
    }
    res.status(HTTP_STATUS_CODES.OK).json({ student });
  } catch (error) {
    console.log("Error occured", error);
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error });
  }
});

const deleteStudent = asyncWrapper(async (req, res) => {
  const studentsId = req.params.id;
  try {
    const student = Student.findByIdAndDelete(studentsId);
    if (!student) {
      res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
    }
    res
      .status(HTTP_STATUS_CODES.OK)
      .json({ message: `Deleted student with ${studentsId} id` });
  } catch (error) {
    console.log("Error occured", error);
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error });
  }
});

module.exports = {
  createStudent,
  getStudents,
  getSingleStudent,
  partiallyUpdateStudent,
  updateStudent,
  deleteStudent,
};
