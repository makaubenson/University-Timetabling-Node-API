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
    data: {
      school,
    },
  });
  next();
});

//Update School
exports.updateSchool = catchAsync(async (req, res, next) => {
  //get the schoolid specified in the params
  const schId = req.params.schoolid;
  // console.log(`School ID 1:`, schId);

  //get data on the req.body
  const schoolData = {
    schoolId: req.body.schoolId,
    schoolName: req.body.schoolName,
    shortName: req.body.shortName,
  };
  // console.log(`School Data:`, schoolData);

  School.findOneAndUpdate(
    { _id: schId },
    { $set: schoolData },
    { new: true },
    (err, updatedSchool) => {
      if (err) return next(new AppError(`${err}`, 500));
      if (!updatedSchool) return next(new AppError('School not found', 404));
      res.status(200).json({
        status: 'success',
        data: {
          updatedSchool,
        },
      });
    }
  );
  next();
});

//delete school
exports.deleteSchool = catchAsync(async (req, res, next) => {
  //get the schoolid specified in the params
  const schId = req.params.schoolid;
  // console.log(`School ID 1:`, schId);

  //delete school
  const deletedSchool = await School.findByIdAndDelete(schId);

  if (!deletedSchool)
    return next(new AppError('No School with that Id Found!', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });

  next();
});

//Get All Schools
exports.getAllSchools = catchAsync(async (req, res, next) => {
  const schools = await School.find();
  res.status(200).json({
    status: 'success',
    results: schools.length,
    data: {
      schools,
    },
  });
});
