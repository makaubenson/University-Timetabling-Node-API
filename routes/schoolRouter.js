const express = require('express');
const authController = require('../controllers/authController');
const schoolController = require('../controllers/schoolController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.post(
  '/addSchool',
  authController.isLoggedIn,
  schoolController.createSchool
);

module.exports = router;
