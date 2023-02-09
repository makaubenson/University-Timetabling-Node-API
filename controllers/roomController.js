const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const Room = require('../models/roomModel');

//Add a new room
exports.createRoom = catchAsync(async (req, res, next) => {
  //1) Check if a Room with the same Roomd ID already exists
  const existingRoom = await Room.findOne({
    roomId: req.body.roomId,
  });

  //2) if it exists, return the error
  if (existingRoom) {
    return next(
      new AppError(
        `A Room with the id "${req.body.roomId}" already exists`,
        400
      )
    );
  }

  //3)if no Room with that name exists, create a new Room
  const room = await Room.create({
    roomId: req.body.roomId,
    roomName: req.body.roomName,
    roomCapacity: req.body.roomCapacity,
    dateCreated: new Date(),
  });

  res.status(201).json({
    status: 'success',
    data: {
      room,
    },
  });
  //   next();
});

//update room
exports.updateRoom = catchAsync(async (req, res, next) => {
  //get the roomid specified in the params
  const roomId = req.params.roomid;
  // console.log(`Room ID 1:`, roomId);

  //get data on the req.body
  const roomData = {
    roomId: req.body.roomId,
    roomName: req.body.roomName,
    roomCapacity: req.body.roomCapacity,
  };
  // console.log(`Room Data:`, roomData);

  Room.findOneAndUpdate(
    { _id: roomId },
    { $set: roomData },
    { new: true },
    (err, updatedRoom) => {
      if (err) return next(new AppError(`${err}`, 500));
      if (!updatedRoom) return next(new AppError('Room Not Found!', 404));
      res.status(200).json({
        status: 'success',
        data: {
          updatedRoom,
        },
      });
    }
  );
});

//delete room
exports.deleteRoom = catchAsync(async (req, res, next) => {
  //get the roomid specified in the params
  const roomId = req.params.roomid;
  // console.log(`Room ID 1:`, roomId);

  //delete room
  const deletedRoom = await Room.findByIdAndDelete(roomId);

  if (!deletedRoom) return next(new AppError('Room Not Found!', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });

  // next();
});

// //Get all Rooms
// exports.getAllCourses = catchAsync(async (req, res, next) => {
//   //fetch all courses
//   //populate('department') adds details of department on the result
//   const courses = await Course.find().populate('department');
//   console.log(courses);

//   // Filter courses with a populated department field
//   // const filteredCourses = courses.filter(
//   //   course => course.department
//   // );

//   res.status(200).json({
//     status: 'success',
//     results: courses.length,
//     data: {
//       courses,
//     },
//   });
// });
