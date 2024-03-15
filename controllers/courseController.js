const Course = require("../models/courseModel");
const asyncWrapper = require("../middleware/asyncWrapper");
const HTTP_STATUS_CODES = require("../utils/statusCodes");
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path') 
const ejs = require('ejs')
const fsp = require('fs/promises')
const htmlDir = 'public/templates'
const createCourse = asyncWrapper(async (req, res) => {
  const { courseId, duration, instructor, startDate, end, fee, username } = req.body;
  const file = req.files
  const course = new Course({
    courseId,
    duration,
    instructor,
    startDate,
    end,
    fee,
    username,
    file
  });
  const saveCourse = await course.save();
  await generatePdf(saveCourse)
  res.status(HTTP_STATUS_CODES.CREATED).json({ saveCourse: saveCourse });
});

const getCourses = asyncWrapper(async (req, res) => {
  const courses = await Course.find({}).sort({ createdAt: -1 });

  if (!courses) {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
  }
  res.status(HTTP_STATUS_CODES.OK).json({ courses });
});

const getSingleCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.id;
  const course = await Course.findById(courseId);

  if (!course) {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
  }
  res.status(HTTP_STATUS_CODES.OK).json({ course });
});

// Put request
const updateCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.id;
  const { courseData } = req.body;

  try {
    const course = await Course.findByIdAndUpdate(courseId, courseData, {
      new: true,
    });

    if (!course) {
      res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
    }

    res.status(HTTP_STATUS_CODES.OK).json({ course });
  } catch (error) {
    console.log("Error occured", error);
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error });
  }
});

// Patch Request(Partially Update the course)
const partiallyUpdateCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.id;
  const { courseData } = req.body;

  try {
    const course = await Course.findByIdAndUpdate(courseId, { $set: courseData }, { new: true });

    if (!course) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ error: "Course not found" });
    }

    return res.status(HTTP_STATUS_CODES.OK).json({ course });
  } catch (error) {
    console.error("Error occurred", error);
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error});
  }
});

const deleteCourse = asyncWrapper(async(req, res)=>{
    const courseId = req.params.id
    try{
    const course = Course.findByIdAndDelete(courseId)
    if (!course) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
      }
      res.status(HTTP_STATUS_CODES.OK).json({message: `Deleted course with ${courseId} id`});
    }catch(error){
        console.log("Error occured", error);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error });
    }
})

// get the sums(aggregation pipeline)
const getCourseStats = asyncWrapper(async (req, res) => {
  try {
    const stats = await Course.aggregate([
      {$match: { duration: { $gte: 10 }}},
      {$group : {
        _id: "$courseId",
        avgDuration: {$avg : "$duration"}, //calculates the avarage duration
        avgFee: {$avg : "$fee"}, //get the avarage fee
        minFee: {$min : "$fee"}, //calc min fee
        maxFee: {$max : "$fee"}, //calc max fee
        sumFee: {$sum : "$fee"}, //calc sum of fee
        sumFee: {$sum : 1}, // calcs sum for fee
      }},
      {$sort: {minFee: 1 }},
      {$match: { maxFee: { $gte: 100 }}} // filter where fee is grater than or equal to 100
    ]);
    res
      .status(HTTP_STATUS_CODES.OK)
      .json({ count: stats.length, status: "success", data: {stats} });
  } catch (error) {
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: error });
  }
});

const generatePdf = async function(course){
  console.log("Course Data", course);
  const tempFileName = `${course.username}-${Date.now()}-${Math.ceil(Math.random() * 1000)}`;
  
  const savePath = path.join(__dirname, '../public/pdf', tempFileName + '.pdf');
  console.log("savePath", savePath);

  try {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const htmlFilePath = path.join(htmlDir, 'course.html');
  console.log("htmlFilePath",typeof htmlFilePath);

  const fileData = await fsp.readFile(htmlFilePath, 'utf-8');
  const renderHtml = ejs.render(fileData, {course: course})

  // Set content using rendered HTML
  await page.setContent(renderHtml, { waitUntil: "networkidle2" });

  const pdfOptions = {
    path: savePath,
    format: 'A4',
    printBackground: true
  }

  // Generate PDF
  const pdf = await page.pdf(pdfOptions);
  console.log("Pdf generated successfully", pdf);
  await browser.close();
  } catch (error) {
    console.log(error)
    return {messaghe: "Error while generating PDF:"}
  }
  
};



module.exports = { createCourse, getCourses, getSingleCourse, partiallyUpdateCourse, updateCourse,deleteCourse, getCourseStats};
