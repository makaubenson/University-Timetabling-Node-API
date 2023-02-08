const express = require('express');
const authController = require('../controllers/authController');
const unitController = require('../controllers/unitController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

//add a new unit
router.post('/addUnit', authController.isLoggedIn, unitController.createUnit);

module.exports = router;
