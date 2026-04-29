const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getSubscriptions,
    getSubscriptionById,
    addManualSubscription,
    updateSubscription,
    pauseSubscription,
    resumeSubscription,
    deleteSubscription,
    getSuggestions,
    approveSuggestion,
    rejectSuggestion
} = require('../controllers/subscriptions.controller');

// All routes require authentication
router.use(protect);

// IMPORTANT: Suggestions routes MUST come before /:id routes
// Suggestions routes
router.get('/suggestions', getSuggestions);
router.post('/suggestions/:suggestionId/approve', approveSuggestion);
router.delete('/suggestions/:suggestionId/reject', rejectSuggestion);

// Subscription CRUD (these come AFTER suggestions)
router.route('/')
    .get(getSubscriptions)
    .post(addManualSubscription);

router.route('/:id')
    .get(getSubscriptionById)
    .put(updateSubscription)
    .delete(deleteSubscription);

// Subscription actions
router.patch('/:id/pause', pauseSubscription);
router.patch('/:id/resume', resumeSubscription);

module.exports = router;
