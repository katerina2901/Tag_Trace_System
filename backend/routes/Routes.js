const express = require('express');
const router = express.Router();
const controller = require('../controllers/Controller');

router.post('/login', controller.login);
router.post('/register', controller.register);
router.post('/pills/create', controller.createPill);
router.get('/pills/:secret', controller.getPillInfo);
router.post('/pills/scan', controller.scanPill);

module.exports = router;