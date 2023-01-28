const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getMe = (req, res, next) => {
  const user = req.user;
  res.json(user);
  next();
};
