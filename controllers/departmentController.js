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
  //   next();
});

//update department
exports.updateDepartment = catchAsync(async (req, res, next) => {
  //get the departmentid specified in the params
  const dptId = req.params.departmentid;
  // console.log(`Department ID 1:`, dptId);

  //get data on the req.body
  const departmentData = {
    departmentId: req.body.departmentId,
    departmentName: req.body.departmentName,
    school: req.body.schoolid,
  };
  // console.log(`Department Data:`, departmentData);

  Department.findOneAndUpdate(
    { _id: dptId },
    { $set: departmentData },
    { new: true },
    (err, updatedDepartment) => {
      if (err) return next(new AppError(`${err}`, 500));
      if (!updatedDepartment)
        return next(new AppError('Department not found', 404));
      res.status(200).json({
        status: 'success',
        data: {
          updatedDepartment,
        },
      });
    }
  );
});

//delete department
exports.deleteDepartment = catchAsync(async (req, res, next) => {
  //get the departmentid specified in the params
  const dptId = req.params.departmentid;
  // console.log(`Department ID 1:`, dptId);

  //delete department
  const deletedDepartment = await Department.findByIdAndDelete(dptId);

  if (!deletedDepartment)
    return next(new AppError('No Department with that Id Found!', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });

  // next();
});

//Get all Departments
exports.getAllDepartments = catchAsync(async (req, res, next) => {
  //fetch all departments
  //populate('school') adds details of schools on the result
  const departments = await Department.find().populate('school');
  //   console.log(departments);

  // Filter departments with a populated school field
  // const filteredDepartments = departments.filter(
  //   department => department.school
  // );

  res.status(200).json({
    status: 'success',
    results: departments.length,
    data: {
      departments,
    },
  });
});
