const mongoose = require('mongoose');
const Joi = require('joi');

//create schema
const unitSchema = new mongoose.Schema({
  unitId: {
    type: String,
    required: true,
    unique: true,
  },
  unitName: {
    type: String,
    required: true,
    unique: true,
  },
  unitType: {
    type: String,
    enum: ['Theory', 'Practical'],
    default: 'Theory',
  },
  unitNature: {
    type: String,
    enum: ['Compulsory', 'Elective'],
    default: 'Compulsory',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  //linking unit to course
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  //linking unit to semester
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
  },
  dateCreated: {
    type: Date,
    required: true,
  },
});

//validate schema
unitSchema.methods.validateData = function () {
  const schema = Joi.object({
    unitId: Joi.string().required(),
    unitName: Joi.string().required(),
    unitType: Joi.string().required(),
    dateCreated: Joi.date().required(),
  });

  return schema.validate(this);
};

//create model
const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;
