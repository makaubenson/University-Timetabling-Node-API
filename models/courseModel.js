const mongoose = require('mongoose');
const Joi = require('joi');

//create schema
const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true,
  },
  courseName: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  //linking course to school
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  dateCreated: {
    type: Date,
    required: true,
  },
});

//validate schema
courseSchema.methods.validateData = function () {
  const schema = Joi.object({
    courseId: Joi.string().required(),
    courseName: Joi.string().required(),
    dateCreated: Joi.date().required(),
  });

  return schema.validate(this);
};

//create model
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
