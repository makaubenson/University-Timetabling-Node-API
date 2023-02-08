const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const Course = require('../models/courseModel');

//Add a new course
exports.createCourse = catchAsync(async (req, res, next) => {
  //1) Check if a Course with the same Coursed ID already exists
  const existingCourse = await Course.findOne({
    courseId: req.body.courseId,
  });

  //2) if it exists, return the error
  if (existingCourse) {
    return next(
      new AppError(
        `A Course with the name "${req.body.courseName}" already exists`,
        400
      )
    );
  }

  //3)if no Course with that name exists, create a new Course
  const course = await Course.create({
    courseId: req.body.courseId,
    courseName: req.body.courseName,
    department: req.body.departmentid,
    dateCreated: new Date(),
  });

  res.status(201).json({
    status: 'success',
    data: {
      course,
    },
  });
  //   next();
});

//update course
exports.updateCourse = catchAsync(async (req, res, next) => {
  //get the courseid specified in the params
  const crsId = req.params.courseid;
  // console.log(`Course ID 1:`, crsId);

  //get data on the req.body
  const courseData = {
    courseId: req.body.courseId,
    courseName: req.body.courseName,
    department: req.body.departmentid,
  };
  // console.log(`Course Data:`, courseData);

  Course.findOneAndUpdate(
    { _id: crsId },
    { $set: courseData },
    { new: true },
    (err, updatedCourse) => {
      if (err) return next(new AppError(`${err}`, 500));
      if (!updatedCourse) return next(new AppError('Course Not Found!', 404));
      res.status(200).json({
        status: 'success',
        data: {
          updatedCourse,
        },
      });
    }
  );
});

//delete course
exports.deleteCourse = catchAsync(async (req, res, next) => {
  //get the courseid specified in the params
  const crsId = req.params.courseid;
  // console.log(`Course ID 1:`, crsId);

  //delete course
  const deletedCourse = await Course.findByIdAndDelete(crsId);

  if (!deletedCourse) return next(new AppError('Course Not Found!', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });

  // next();
});

//Get all Courses
exports.getAllCourses = catchAsync(async (req, res, next) => {
  //fetch all courses
  //populate('department') adds details of department on the result
  const courses = await Course.find().populate('department');
  console.log(courses);

  // Filter courses with a populated department field
  // const filteredCourses = courses.filter(
  //   course => course.department
  // );

  res.status(200).json({
    status: 'success',
    results: courses.length,
    data: {
      courses,
    },
  });
});
