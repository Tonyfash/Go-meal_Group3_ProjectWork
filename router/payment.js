const { initializePayment, verifyPayment } = require('../controller/payment');

const router = require('express').Router();

router.get('/make-payment/:userId/:productId', initializePayment);

router.get('/verify-payment', verifyPayment);

module.exports = router;