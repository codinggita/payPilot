const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getUploadHistory, getStatementStats, getDataPreview } = require('../controllers/statement.controller');

router.use(protect);

router.get('/history', getUploadHistory);
router.get('/stats', getStatementStats);
router.get('/preview', getDataPreview);

module.exports = router;
