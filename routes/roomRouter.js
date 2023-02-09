const express = require('express');
const authController = require('../controllers/authController');
const roomController = require('../controllers/roomController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);
router.use(authController.isLoggedIn);

//add a new room
router.post('/addRoom', roomController.createRoom);

//update room
router.patch('/updateRoom/:roomid', roomController.updateRoom);
module.exports = router;
