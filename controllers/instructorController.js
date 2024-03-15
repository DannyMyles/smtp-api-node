const Instructor = require('../models/instructorModel')
const asyncWrapper = require("../middleware/asyncWrapper");
const HTTP_STATUS_CODES = require("../utils/statusCodes");

const createInstructor = asyncWrapper(async (req, res) => {
  const { username,email,phone,gender,isPrincipal,fullName,password} = req.body;
  const instructor = new Instructor({
    username,
    email,
    phone,
    gender,
    isPrincipal,
    fullName,
    password,
  });
  const saveInstructor = await instructor.save();
  res.status(HTTP_STATUS_CODES.CREATED).json({ saveInstructor});
});

const getInstructors = asyncWrapper(async (req, res) => {
  const instructors = await Instructor.find({}).sort({ createdAt: -1 });

  if (!instructors) {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
  }
  res.status(HTTP_STATUS_CODES.OK).json({ instructors });
});

const getSingleInstructor = asyncWrapper(async (req, res) => {
  const instructorId = req.params.id;
  const instructor = await Instructor.findById(instructorId);

  if (!instructor) {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
  }
  res.status(HTTP_STATUS_CODES.OK).json({ instructor });
});

// Put request
const updateInstructor = asyncWrapper(async (req, res) => {
  const instructorId = req.params.id;
  const { instructorData } = req.body;

  try {
    const instructor = await Instructor.findByIdAndUpdate(instructorId, instructorData, {
      new: true,
    });

    if (!instructor) {
      res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
    }

    res.status(HTTP_STATUS_CODES.OK).json({ instructor });
  } catch (error) {
    console.log("Error occured", error);
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error });
  }
});

// Patch Request(Partially Update the instructor)
const partiallyUpdateInstructor = asyncWrapper(async (req, res) => {
  const instructorId = req.params.id;
  const { instructorData } = req.body;

  try {
    const instructor = await Instructor.findByIdAndUpdate(instructorId, { $set: instructorData}, {new: true})

    if (!instructor) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
      }
      res.status(HTTP_STATUS_CODES.OK).json({ instructor });
  } catch (error) {
    console.log("Error occured", error);
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error });
  }
});

const deleteInstructor = asyncWrapper(async(req, res)=>{
    const instructorId = req.params.id
    try{
    const instructor = Instructor.findByIdAndDelete(instructorId)
    if (!instructor) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
      }
      res.status(HTTP_STATUS_CODES.OK).json({message: `Deleted instructor with ${instructorId} id`});
    }catch(error){
        console.log("Error occured", error);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error });
    }
})

module.exports = { createInstructor, getInstructors, getSingleInstructor, partiallyUpdateInstructor, updateInstructor, deleteInstructor };
