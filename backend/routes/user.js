const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const validateUser = require('../middleware/validateUser');

router.post('/signup', validateUser, userCtrl.signup);
router.post('/login', validateUser, userCtrl.login);

module.exports = router;
