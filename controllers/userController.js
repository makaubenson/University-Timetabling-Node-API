const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Email = require("../utils/email");

//method to sign a jsonwebtoken
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// creates a JSON Web Token (JWT) and sends it to the client in a cookie.
const createSendToken = (user, statusCode, req, res) => {
  //sign the jwt
  const token = signToken(user._id);

  //store the JWT in the cookie named `jwt`
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // req.headers["x-forwarded-proto"] is a property in the request headers that indicates the protocol that was used by the client to make the request to the server.
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

//signup user
exports.signup = catchAsync(async (req, res, next) => {
  //1) create user
  const newUser = await User.create({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `${req.protocol}://${req.get("host")}/me`;

  //2)send successful signup email
  await new Email(newUser, url).sendWelcomeMessage();

  // 3) If everything ok, send token to client
  createSendToken(newUser, 200, req, res);
});
