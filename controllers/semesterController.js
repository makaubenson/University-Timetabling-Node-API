const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const Semester = require('../models/semesterModel');

//Add a new semester
exports.createSemester = catchAsync(async (req, res, next) => {
  //1) Check if a semester with the same semester id already exists
  const existingSemester = await Semester.findOne({
    semesterId: req.body.semesterId,
  });

  //2) if it exists, return the error
  if (existingSemester) {
    return next(
      new AppError(
        `A Semester with the name "${req.body.semesterName}" already exists`,
        400
      )
    );
  }

  //3)if no semester with that name exists, create a new semester
  const semester = await Semester.create({
    semesterId: req.body.semesterId,
    semesterName: req.body.semesterName,
    dateCreated: new Date(),
  });

  res.status(201).json({
    status: 'success',
    data: {
      semester,
    },
  });
  //   next();
});

//Update Semester
exports.updateSemester = catchAsync(async (req, res, next) => {
  //get the semesterid specified in the params
  const semId = req.params.semesterid;
  // console.log(`Semester ID 1:`, semId);

  //get data on the req.body
  const semesterData = {
    semesterId: req.body.semesterId,
    semesterName: req.body.semesterName,
  };
  // console.log(`Semester Data:`, semesterData);

  Semester.findOneAndUpdate(
    { _id: semId },
    { $set: semesterData },
    { new: true },
    (err, updatedSemester) => {
      if (err) return next(new AppError(`${err}`, 500));
      if (!updatedSemester)
        return next(new AppError('Semester not found', 404));
      res.status(200).json({
        status: 'success',
        data: {
          updatedSemester,
        },
      });
    }
  );
  // next();
});
