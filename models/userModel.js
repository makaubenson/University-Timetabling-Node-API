//User Model
const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

//Create a schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    minlength: 4,
  },
  firstname: {
    type: String,
    required: [true, "Please tell us your first name!"],
  },
  lastname: {
    type: String,
    required: [true, "Please tell us your last name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  role: {
    type: String,
    enum: ["student", "lecturer", "labTechnician", "chair", "dean", "admin"],
    default: "student",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false, //can't display the password field on fetching data
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false, //hides the value of active on fetching data
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 9 if password is modified
  this.password = await bcrypt.hash(this.password, 9);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// This code is a Mongoose middleware function that is executed before any query
//that starts with "find" on the User schema.

// This means that any query that starts with "find" will only return documents
// where the active property is true.
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  //   If the passwordChangedAt property does not exist or if the JWTTimestamp is
  // greater than or equal to the changedTimestamp, it means that the password
  //was not changed after the JWT was issued, and the method returns false.
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes

  return resetToken;
};

//create model
// The model will be used to interact with the MongoDB database and
//perform CRUD operations on the "users" collection. It provides a set of methods
// for creating, reading, updating, and deleting documents in the "users" collection.

//mongoose.model(modelName, schema)
const User = mongoose.model("User", userSchema);

module.exports = User;
