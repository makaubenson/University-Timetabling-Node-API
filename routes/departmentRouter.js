const express = require('express');
const authController = require('../controllers/authController');
const departmentController = require('../controllers/departmentController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

//add a new department
router.post(
  '/addDepartment',
  authController.isLoggedIn,
  departmentController.createDepartment
);

//update department
router.patch(
  '/updateDepartment/:departmentid',
  departmentController.updateDepartment
);

// delete department
router.delete(
  '/deleteDepartment/:departmentid',
  departmentController.deleteDepartment
);

router.get('/allDepartments', departmentController.getAllDepartments);

module.exports = router;
