const express = require('express');
const { signUp } = require('../controllers/authentication/authenticateController');
const router = express.Router();

router.route("/signup").post(signUp)

module.exports = router;