const {
  createInstructor,
  getInstructors,
  getSingleInstructor,
  partiallyUpdateInstructor,
  updateInstructor,
  deleteInstructor,
} = require("../controllers/instructorController");

const express = require("express");
const router = express.Router();

router.route("/instructors").post(createInstructor).get(getInstructors);
router
  .route("/instructors/:id")
  .get(getSingleInstructor)
  .put(updateInstructor)
  .patch(partiallyUpdateInstructor)
  .delete(deleteInstructor);

module.exports = router;
