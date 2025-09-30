const productModel = require('../model/product');


exports.createProduct = async (req, res) => {
  try {
    const { productName, price } = req.body;
    const existProduct = await productModel.findOne({ productName: productName });

    if (existProduct) {
      return res.status(400).json({
        message: 'Product already exist'
      })
    };

    const product = new productModel({
      productName,
      price
    });

    await product.save();
    res.status(201).json({
      message: 'Product created successfully',
      data: product
    })
  } catch (error) {
    res.status(500).json({
      message: `Error creating product: ${error.message}`
    })
  }
};


exports.getAll = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json({
      message: 'All products',
      data: products
    })
  } catch (error) {
    res.status(500).json({
      message: `Error getting all products: ${error.message}`
    })
  }
};


exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      })
    };

    res.status(200).json({
      message: "Product",
      data: product
    })
  } catch (error) {
    res.status(500).json({
      message: `Error getting product: ${error.message}`
    })
  }
};