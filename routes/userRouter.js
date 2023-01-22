let express = require("express");

//Import authentication Controller
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);

module.exports = router;
