const { createProduct } = require('../controller/product');

const router = require('express').Router();

router.post('/create-product', createProduct);

module.exports = router;