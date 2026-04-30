const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { globalSearch, getSearchSuggestions } = require('../controllers/search.controller');

router.use(protect);

router.get('/', globalSearch);
router.get('/suggestions', getSearchSuggestions);

module.exports = router;
