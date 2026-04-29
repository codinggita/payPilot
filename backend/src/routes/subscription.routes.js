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

// Apply authentication to all routes
router.use(protect);

// Main subscription routes
router.route('/')
  .get(getSubscriptions)
  .post(addManualSubscription);

// Suggestions routes
router.get('/suggestions', getSuggestions);
router.post('/suggestions/:suggestionId/approve', approveSuggestion);
router.delete('/suggestions/:suggestionId/reject', rejectSuggestion);

// Subscription action routes
router.patch('/:id/pause', pauseSubscription);
router.patch('/:id/resume', resumeSubscription);
router.delete('/:id', cancelSubscription);

module.exports = router;
