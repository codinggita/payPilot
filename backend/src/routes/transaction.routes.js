const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getTransactions, updateTransaction } = require('../controllers/transaction.controller');

router.use(protect);

router.route('/')
    .get(getTransactions);

router.route('/:id')
    .put(updateTransaction);

module.exports = router;
