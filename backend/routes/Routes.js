const express = require('express');
const { createPill, getPillInfo, scanPill } = require('../controllers/Controller');

const router = express.Router();

router.post('/create', (req, res, next) => {
    console.log('Received request to create pill');
    next();
  }, createPill);

router.get('/:secret', (req, res, next) => {
    console.log(`Received request to get pill info for secret: ${req.params.secret}`);
    next();
  }, getPillInfo);

router.post('/scan', (req, res, next) => {
    console.log('Received request to scan pill');
    next();
}, scanPill);

module.exports = router;