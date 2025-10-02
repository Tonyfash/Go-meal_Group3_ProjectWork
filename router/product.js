const { createProduct } = require('../controller/product');
const uploads = require('../middleware/multer');

const router = require('express').Router();

router.post('/create-product', uploads.array('productImages', 5), createProduct);

module.exports = router;