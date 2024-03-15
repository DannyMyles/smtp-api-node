const {
  createStudent,
  getStudents,
  getSingleStudent,
  partiallyUpdateStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const express = require("express");
const router = express.Router();

router.route("/students").post(createStudent).get(getStudents);
router
  .route("/students/:id")
  .get(getSingleStudent)
  .put(updateStudent)
  .patch(partiallyUpdateStudent)
  .delete(deleteStudent);

module.exports = router;
