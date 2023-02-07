const mongoose = require('mongoose');
const Joi = require('joi');

//create schema
const departmentSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    required: true,
    unique: true,
  },
  departmentName: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  //linking department to school
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
  },
  dateCreated: {
    type: Date,
    required: true,
  },
});

//validate schema
departmentSchema.methods.validateData = function () {
  const schema = Joi.object({
    departmentId: Joi.string().required(),
    departmentName: Joi.string().required(),
    dateCreated: Joi.date().required(),
  });

  return schema.validate(this);
};

//create model
const department = mongoose.model('Department', departmentSchema);

module.exports = department;
