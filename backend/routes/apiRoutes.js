const express = require('express');
const router = express.Router();
const rulesController = require('../controllers/rulesController');
const authGuard = require('../middleware/authGuard');

// All API routes require authentication
router.use(authGuard);

router.get('/validation-rules', rulesController.getValidationRules);
router.post('/toggle-rule', rulesController.toggleRule);
router.post('/toggle-all', rulesController.toggleAllRules);
router.post('/deploy', rulesController.deployRule);
router.get('/org-info', rulesController.getOrgInfo);

module.exports = router;
