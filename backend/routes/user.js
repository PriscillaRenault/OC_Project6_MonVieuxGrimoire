const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validateUser');

const userCtrl = require('../controllers/user');

router.post('/signup', validateUser, userCtrl.signup);
router.post('/login', validateUser, userCtrl.login);

module.exports = router;
