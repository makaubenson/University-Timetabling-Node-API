const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
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

//Login user
exports.login = catchAsync(async (req, res, next) => {
  //get email and password from req.body
  const { email, username, password } = req.body;

  // 1) Check if username and password exist
  if (!username || !password) {
    // console.log(username);
    return next(
      new AppError("Please provide both username and password!", 400)
    );
  }

  //2) Check id user exists and password is correct
  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or Password", 401));
  }

  // 3) If everything is OK, send token to client
  createSendToken(user, 200, req, res);
});

//Logout user
exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

//protect routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    //Bearer vhdnvbscrwgdscvsdgcveghsdchd
    token = req.headers.authorization.split(" ")[1]; // this code will get the `vhdnvbscrwgdscvsdgcveghsdchd` part
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  //if token is NOT FOUND
  if (!token) {
    return next(
      new AppError(
        "You are not logged in! Please log in to get access this resource.",
        401
      )
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded, "DECODED TOKEN");
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
});

//Check if user is logged in or not
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      //res.locals is an object in Express.js that can be used to store data
      // that is local to a single request/response cycle and can be accessed in the view templates.
      //In this code, res.locals.user is being used to store the current user object if the user is
      //logged in, so it can be accessed and used in the view templates. By setting the user property
      //on res.locals, the user object will be available in the views as a local variable, without the
      //need to pass it explicitly in each render call.
      res.locals.user = currentUser;

      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
