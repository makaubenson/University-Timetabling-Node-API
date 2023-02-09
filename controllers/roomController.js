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

// //update course
// exports.updateCourse = catchAsync(async (req, res, next) => {
//   //get the courseid specified in the params
//   const crsId = req.params.courseid;
//   // console.log(`Course ID 1:`, crsId);

//   //get data on the req.body
//   const courseData = {
//     courseId: req.body.courseId,
//     courseName: req.body.courseName,
//     department: req.body.departmentid,
//   };
//   // console.log(`Course Data:`, courseData);

//   Course.findOneAndUpdate(
//     { _id: crsId },
//     { $set: courseData },
//     { new: true },
//     (err, updatedCourse) => {
//       if (err) return next(new AppError(`${err}`, 500));
//       if (!updatedCourse) return next(new AppError('Course Not Found!', 404));
//       res.status(200).json({
//         status: 'success',
//         data: {
//           updatedCourse,
//         },
//       });
//     }
//   );
// });

// //delete course
// exports.deleteCourse = catchAsync(async (req, res, next) => {
//   //get the courseid specified in the params
//   const crsId = req.params.courseid;
//   // console.log(`Course ID 1:`, crsId);

//   //delete course
//   const deletedCourse = await Course.findByIdAndDelete(crsId);

//   if (!deletedCourse) return next(new AppError('Course Not Found!', 404));

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });

//   // next();
// });

// //Get all Courses
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
