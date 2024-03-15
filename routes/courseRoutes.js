const {
  createCourse,
  getCourses,
  getSingleCourse,
  partiallyUpdateCourse,
  updateCourse,
  deleteCourse,
  getCourseStats
} = require("../controllers/courseController");
const multer = require("multer")
const express = require("express")
const router =  express.Router()
const fs = require("fs")
const dir = 'public/images/uploads'


if(!fs.existsSync(dir)){
  fs.mkdirSync(dir, {recursive: true})
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage });

router.route("/imageUpload").post(upload.single("file"), async (req, res) => {
  const file = req.file;
  console.log("File uploaded:", file);
  res.status(201).json(file);
});

router.route("/courses",).post(createCourse).get(getCourses)
router.route("/courses/:id").get(getSingleCourse).put(updateCourse).patch(partiallyUpdateCourse).delete(deleteCourse)
router.route("/getStats").get(getCourseStats)


module.exports = router