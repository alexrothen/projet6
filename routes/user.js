// const express = require('express');
// const router = express.Router();

// const usersCtrl = require('../controllers/user');

// router.post('/signup', usersCtrl.signup);
// router.post('/login', usersCtrl.login);

// module.exports = router;

const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;


