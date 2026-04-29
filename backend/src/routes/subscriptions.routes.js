const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getSubscriptions,
  getSuggestions,
  approveSuggestion,
  rejectSuggestion,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  addManualSubscription
} = require('../controllers/subscriptions.controller');

router.use(protect);

router.route('/').get(getSubscriptions).post(addManualSubscription);
router.get('/suggestions', getSuggestions);
router.post('/suggestions/:suggestionId/approve', approveSuggestion);
router.delete('/suggestions/:suggestionId/reject', rejectSuggestion);
router.patch('/:id/pause', pauseSubscription);
router.patch('/:id/resume', resumeSubscription);
router.delete('/:id', cancelSubscription);

module.exports = router;
