const mongoose = require('mongoose');
const Joi = require('joi');

//create schema
const schoolSchema = new mongoose.Schema({
  schoolId: {
    type: String,
    required: true,
    unique: true,
  },
  schoolName: {
    type: String,
    required: true,
    unique: true,
  },
  shortName: {
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
schoolSchema.methods.validateData = function () {
  const schema = Joi.object({
    schoolId: Joi.string().required(),
    schoolName: Joi.string().required(),
    shortName: Joi.string().required(),
    dateCreated: Joi.date().required(),
  });

  return schema.validate(this);
};

//create model
const School = mongoose.model('School', schoolSchema);

module.exports = School;
