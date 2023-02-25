const express = require('express');
const authController = require('../controllers/authController');
const schoolController = require('../controllers/schoolController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

//add a new school
router.post(
  '/addSchool',
  authController.isLoggedIn,
  schoolController.createSchool
);

//update school
router.patch('/updateSchool/:schoolid', schoolController.updateSchool);

//delete school
router.delete('/deleteSchool/:schoolid', schoolController.deleteSchool);

router.get('/allSchools', schoolController.getAllSchools);

module.exports = router;
