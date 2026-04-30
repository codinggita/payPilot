const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getRewards,
    getRewardById,
    createReward,
    updateReward,
    deleteReward,
    getRewardsSummary
} = require('../controllers/reward.controller');

router.use(protect);

router.route('/')
    .get(getRewards)
    .post(createReward);

router.get('/summary/sources', getRewardsSummary);

router.route('/:id')
    .get(getRewardById)
    .put(updateReward)
    .delete(deleteReward);

module.exports = router;
