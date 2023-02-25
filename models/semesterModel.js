const mongoose = require('mongoose');
const Joi = require('joi');

//create schema
const semesterSchema = new mongoose.Schema({
  semesterId: {
    type: String,
    required: true,
    unique: true,
  },
  semesterName: {
    type: String,
    required: true,
    unique: true,
  },

  dateCreated: {
    type: Date,
    required: true,
  },
});

//validate schema
semesterSchema.methods.validateData = function () {
  const schema = Joi.object({
    semesterId: Joi.string().required(),
    semesterName: Joi.string().required(),
    dateCreated: Joi.date().required(),
  });

  return schema.validate(this);
};

//create model
const Semester = mongoose.model('Semester', semesterSchema);

module.exports = Semester;
