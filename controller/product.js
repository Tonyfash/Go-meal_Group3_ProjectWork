const productModel = require('../model/product');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');


exports.createProduct = async (req, res) => {
  try {
        const {productName, price} = req.body;
        const files = req.files;
        let response;
        let listOfProducts = [];
        let product = {};

        if (files && files.length > 0) {
            for (const file of files) {
                response = await cloudinary.uploader.upload(file.path);
                product = {
                    imageUrl: response.secure_url,
                    publicId: response.public_id
                };
                listOfProducts.push(product);
                fs.unlinkSync(file.path)
            }
        };
        const products = await productModel.create({
            productName,
            price,
            productImages: listOfProducts
        })
        res.status(201).json({
            message: 'Products created successfully',
            data: products
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: `Internal Server Error:  ${error.message}`
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