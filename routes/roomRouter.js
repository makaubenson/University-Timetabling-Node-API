const express = require('express');
const authController = require('../controllers/authController');
const roomController = require('../controllers/roomController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

//add a new room
router.post('/addRoom', authController.isLoggedIn, roomController.createRoom);

module.exports = router;
