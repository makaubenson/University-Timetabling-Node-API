const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const Unit = require('../models/unitModel');

//Add a new unit
exports.createUnit = catchAsync(async (req, res, next) => {
  //1) Check if a unit with the same unit ID already exists
  const existingUnit = await Unit.findOne({
    unitId: req.body.unitId,
  });

  //2) if it exists, return the error
  if (existingUnit) {
    return next(
      new AppError(`The unit code "${req.body.unitId}" already exists`, 400)
    );
  }

  //3)if no Unit with that name exists, create a new Unit
  const unit = await Unit.create({
    unitId: req.body.unitId,
    unitName: req.body.unitName,
    unitType: req.body.unitType,
    unitNature: req.body.unitNature,
    course: req.body.courseid,
    semester: req.body.semesterid,
    dateCreated: new Date(),
  });

  res.status(201).json({
    status: 'success',
    data: {
      unit,
    },
  });
  //   next();
});
