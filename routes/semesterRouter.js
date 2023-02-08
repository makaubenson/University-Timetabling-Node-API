const express = require('express');
const authController = require('../controllers/authController');
const semesterController = require('../controllers/semesterController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

//add a new semester
router.post(
  '/addSemester',
  authController.isLoggedIn,
  semesterController.createSemester
);

// //update semester
router.patch('/updateSemester/:semesterid', semesterController.updateSemester);

// // delete department
router.delete('/deleteSemester/:semesterid', semesterController.deleteSemester);

// router.get('/allCourses', courseController.getAllCourses);

module.exports = router;
