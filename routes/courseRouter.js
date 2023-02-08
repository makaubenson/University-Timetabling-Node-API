const express = require('express');
const authController = require('../controllers/authController');
const courseController = require('../controllers/courseController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

//add a new course
router.post(
  '/addCourse',
  authController.isLoggedIn,
  courseController.createCourse
);

// //update course
router.patch('/updateCourse/:courseid', courseController.updateCourse);

// // delete department
// router.delete(
//   '/deleteDepartment/:departmentid',
//   departmentController.deleteDepartment
// );

// router.get('/allDepartments', departmentController.getAllDepartments);

module.exports = router;
