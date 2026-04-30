const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getDashboardStats, getDashboardCharts } = require('../controllers/dashboard.controller');

// All routes require authentication
router.use(protect);

// Dashboard endpoints
router.get('/stats', getDashboardStats);
router.get('/charts', getDashboardCharts);

module.exports = router;
