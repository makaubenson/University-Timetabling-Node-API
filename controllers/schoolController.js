const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const School = require('../models/schoolModel');

//Add a new school
exports.createSchool = catchAsync(async (req, res, next) => {
  //1) Check if a school with the same schoold id already exists
  const existingSchool = await School.findOne({
    schoolId: req.body.schoolId,
  });

  //2) if it exists, return the error
  if (existingSchool) {
    return next(
      new AppError(
        `A school with the name "${req.body.schoolName}" already exists`,
        400
      )
    );
  }

  //3)if no school with that name exists, create a new school
  const school = await School.create({
    schoolId: req.body.schoolId,
    schoolName: req.body.schoolName,
    shortName: req.body.shortName,
    dateCreated: new Date(),
  });

  res.status(201).json({
    status: 'success',
    date: {
      school,
    },
  });
  next();
});
