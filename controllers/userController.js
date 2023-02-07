const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const User = require('../models/userModel');

//Get All Users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

//checkRole middleware used to check if the user has the required role
exports.checkRole = role => {
  return (req, res, next) => {
    // Get the user's role from their data
    const userRole = req.user.role;

    if (userRole !== role) {
      return next(new AppError('Unauthorized,insufficient permissions', 401));
    }
    next();
  };
};
