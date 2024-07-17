const express = require('express');
const router = express.Router();
const controller = require('../controllers/Controller');

router.post('/create', controller.createPill);
router.get('/:secret', controller.getPillInfo);
router.post('/scan', controller.scanPill);

module.exports = router;