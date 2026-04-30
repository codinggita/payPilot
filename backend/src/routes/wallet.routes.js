const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getWallets,
    getWalletById,
    createWallet,
    updateWallet,
    deleteWallet
} = require('../controllers/wallet.controller');

router.use(protect);

router.route('/')
    .get(getWallets)
    .post(createWallet);

router.route('/:id')
    .get(getWalletById)
    .put(updateWallet)
    .delete(deleteWallet);

module.exports = router;
