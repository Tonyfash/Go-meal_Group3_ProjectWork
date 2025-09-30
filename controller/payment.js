const userModel = require('../model/user');
const productModel = require('../model/product');
const paymentModel = require('../model/payment');
const axios = require('axios');
const otpGen = require('otp-generator');


exports.initializePayment = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const user = await userModel.findById(userId);
    const product = await productModel.findById(productId);
    const ref = otpGen.generate(12, { digits: true, lowerCaseAlphabets: true, upperCaseAlphabets: true, specialChars: false });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      })
    };

    const paymentInfo = {
      amount: product.price,
      currency: 'NGN',
      reference: ref,
      customer: {
        email: user.email,
        name: `${user.fullName.split(' ')[0]}`
      },
      redirect_url: 'https://www.google.com'
    }

    const { data } = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', paymentInfo, {
      headers: {
        Authorization: `Bearer ${process.env.KORA}`
      }
    });

    if (data.status && data.status === true) {
      const payment = new paymentModel({
        userId: user._id,
        productId: product._id,
        price: product.price,
        reference: data.data.reference
      })

      await payment.save();
      res.status(200).json({
        message: 'Payment successful',
        data: {
          reference: data.data.reference,
          checkout_url: data.data.checkout_url
        }
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error initializing payment: ' + error.message
    })
  }
};


exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;
    const payment = await paymentModel.findOne({ reference: reference });

    if (!payment) {
      return res.status(404).json({
        message: 'Payment not found'
      })
    };

    const { data } = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.KORA}`
      }
    });

    console.log(data);
    

    if (data.status === true && data.data.status === 'success') {
      Object.assign(payment, { status: 'Successful' });
      await payment.save();
      res.status(200).json({
        message: 'Payment successful'
      })
    } else if(data.status === true && data.data.status === 'processing') {
      Object.assign(payment, { status: 'Pending' });
      await payment.save();
      res.status(200).json({
        message: 'Payment failed'
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error verifying payment: ' + error.message
    })
  }
};