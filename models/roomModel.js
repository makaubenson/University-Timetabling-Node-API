const mongoose = require('mongoose');
const Joi = require('joi');

//create schema
const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  roomName: {
    type: String,
    required: true,
    unique: true,
  },
  roomCapacity: {
    type: Number,
    required: true,
  },

  dateCreated: {
    type: Date,
    required: true,
  },
});

//validate schema
roomSchema.methods.validateData = function () {
  const schema = Joi.object({
    roomId: Joi.string().required(),
    roomName: Joi.string().required(),
    roomCapacity: Joi.number().required(),
    dateCreated: Joi.date().required(),
  });

  return schema.validate(this);
};

//create model
const Room = mongoose.model('Room', courseSchema);

module.exports = Room;
