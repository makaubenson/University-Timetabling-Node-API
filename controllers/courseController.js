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
