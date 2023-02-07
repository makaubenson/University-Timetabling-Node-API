const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const Department = require('../models/departmentModel');

//Add a new department
exports.createDepartment = catchAsync(async (req, res, next) => {
  //1) Check if a Department with the same Departmentd id already exists
  const existingDepartment = await Department.findOne({
    departmentId: req.body.departmentId,
  });

  //2) if it exists, return the error
  if (existingDepartment) {
    return next(
      new AppError(
        `A Department with the name "${req.body.departmentName}" already exists`,
        400
      )
    );
  }

  //3)if no Department with that name exists, create a new Department
  const department = await Department.create({
    departmentId: req.body.departmentId,
    departmentName: req.body.departmentName,
    school: req.body.schoolid,
    dateCreated: new Date(),
  });

  res.status(201).json({
    status: 'success',
    data: {
      department,
    },
  });
  next();
});
