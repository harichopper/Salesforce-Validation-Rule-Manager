const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// OAuth routes
router.get('/salesforce', authController.login);
router.get('/callback', authController.callback);
router.get('/status', authController.status);
router.post('/logout', authController.logout);

module.exports = router;
