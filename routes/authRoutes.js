const express = require('express');
const { signUp,logIn } = require('../controllers/authentication/authController');
const router = express.Router();

router.route("/signup").post(signUp)
router.route("/login").post(logIn)


module.exports = router;