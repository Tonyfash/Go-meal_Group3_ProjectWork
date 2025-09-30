const userModel = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const e = require("cors");
const html = require('../middleware/signUp');
const { sendMail } = require('../middleware/email');
const { forgethtml } = require('../middleware/forget');
const axios = require('axios');


const nodemailer = require("nodemailer");
const {registerOTP} = require("../middleware/otpmail")


// User Registration
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    const file = req.file;

    let response;

    const existingEmail = await userModel.findOne({ email: email.toLowerCase() });
    const existingPhoneNumber = await userModel.findOne({ phoneNumber });

    if (existingEmail || existingPhoneNumber) {
        fs.unlinkSync(file.path);
        return res.status(400).json({
            message: "User with that email or phone number already exists",
        })
    }

    // Hash password
    const saltRounds = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, saltRounds);
    // const otp = Math.round(Math.random() * 10000).toString().padStart(6, "0");
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    
    const newUser = new userModel({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phoneNumber,
      password: hashPassword,
      otp:otp,
      otpExpiredAt: Date.now() + 1000 *120,
      profilePicture: { 
        imageUrl: response?.secure_url,
        publicId: response?.public_id
        },
    });

if (file && file.path) {
      response = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(file.path);
    }
    const detail = {
      email: newUser.email,
      subject: 'Email Verification',
      html: registerOTP(newUser.otp, `${newUser.firstName.split(' ')[0]}`)
    };
    

    await sendMail(detail)
    // await newUser.save();

    // const subject = "Kindly verify your Email";
    // const link = `${req.protocol}://${req.get("host")}/api/v1/verify/${newUser._id}`
    // const message = `<p>Hi ${newUser.firstName},</p>
    //                  <p>Thank you for registering on our platform. Please click the link below to verify your email address:</p>
    //                  <a href="${link}">Verify Email</a>
    //                  <p>If you did not register on our platform, please ignore this email.</p>
    //                  <p>Best regards,</p>
    //                  <p>The GoMeal Team</p>`;

    // await sendMail({
    //     to:email,
    //     subject,
    //     html: html(link, newUser.firstName)
    // })
      let info= {
        firstName: newUser.firstName,
        email: newUser.email
    }

    res.status(201).json({
        message: `Successful Registered ${email}`,
        data: info
    })
  
}catch(error) {
    console.log(error);
    //fs.unlinkSync(file.path)
    res.status(500).json({
        message: `Internal Server Error`+ error.message,
    })
}
};

exports.login = async (req, res) =>{
    try{
        const {email , password} = req.body;
        const checkUser = await userModel.findOne({email:email.toLowerCase().trim()});
        if (!checkUser) {
            return res.status(404).json({
                message: `User not found`
            });
        }

        const checkPassword = await bcrypt.compare(password, checkUser.password)

        if (!checkUser || !checkPassword){
            res.status(400).json({
                message: `Invalid Credentials`
            })
        }
        const token = await jwt.sign({id:checkUser._id}, "cat" , {expiresIn:"1m"})
        res.status(200).json({
            message:`Login Successfully`,
            data: checkUser,
            token
        })
    }catch(error){
        res.status(500).json({
            message:`Internal Server Error`
        });
    }
}

exports.checkAuth = async(req, res) =>{
  try{
    const checkToken = req.headers.authorization  
  if(!checkToken){ 
    return res.status(400).json({ 
      message: "Login Required"});
  }
const token = req.headers.authorization.split(" ")[1]; 
 jwt.verify(token, "cat", async (error, result) =>{
    if(error){
        return res.status(400).json({ 
            message: error.message})
        }else{       

          const checkUser = await userModel.findById(result.id)
          res.status(200).json(`Welcome ${checkUser.firstName}, we are happy to have you here`) 
        }
      })
  } catch(error){
    res.status(500).json({
      message: `Internal Server Error`
    });
  }
}


exports.verifyCode = async (req, res) => {
     try {
    const { otp, email } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: 'user not found'
      })
    };

    if (Date.now() > user.otpExpiredAt) {
      return res.status(400).json({
        message: 'OTP expired'
      })
    };

    if (otp !== user.otp) {
      return res.status(400).json({
        message: 'Invalid OTP'
      })
    };

    Object.assign(user, { isVerified: true, otp: null, otpExpiredAt: null });
    await user.save();
    res.status(200).json({
      message: 'User verified successfully'
    })
  } catch (error) {
    res.status(500).json({
      mesaage: 'Error verifying user' + error.message
    })
  }
};


exports.resendCode = async (req, res) => {
    try {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: 'user not found'
      })
    };

    // const otp = Math.round(Math.random() * 1e6).toString().padStart(6, "0");
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    Object.assign(user, {otp: otp, otpExpiredAt: Date.now() + 1000 * 120});

      const detail = {
      email: user.email,
      subject: 'Resend: Email Verification',
      html: registerOTP(user.otp, `${user.fullName.split(' ')[0]}`)
    };

    await sendMail(detail);
    await user.save();
    res.status(200).json({
      message: 'Otp sent, kindly check your email'
    })
  } catch (error) {
    res.status(500).json({
      mesaage: 'Error resending otp' + error.message
    })
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;  
    const checkEmail = await userModel.findOne({ email: email.toLowerCase() }); 

    if ( !checkEmail) { 
      return res.status(404).json({
        message: 'Invalid email address'
      });
    }
    const token = jwt.sign({ id: checkEmail._id }, "cat", { expiresIn: "2m" }); 

    await userModel.findByIdAndUpdate(checkEmail._id, { token }); 

    const subject = "Password Reset Request"; 

    const link = `${req.protocol}://${req.get("host")}/api/v1/reset/${checkEmail._id}`; 
    
    const message = `Dear ${checkEmail.fullName}, please click the following link to reset your password: ${link}. This link will expire in 1 hour. If you did not request a password reset, please ignore this email.`;
    await sendMail({ 
      to: email,
      subject,
      text: message,
      html: forgethtml(link, checkEmail.email) 
    });
    res.status(200).json({ 
      message: 'Password reset email sent'
    });
  }
    catch (error) {
      res.status(500).json({
        message: 'internal server error' + error.message,
        error: error.message
      });
    }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) { 
      return res.status(400).json({
        message: 'Passwords do not match'
      });
    
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    const userId = req.params.id; 
    const user = await userModel.findById(userId);

    jwt.verify(user.token, "deniel", async (error, result) => {
    if (error) {
      return res.status(404).json({
        message: 'Email Expired'
      });
    } else {
      await userModel.findByIdAndUpdate(result.id, { password: hash, token: null }, { new: true });
      
      res.status(200).json({
        message: 'Password changed successfully'
      });
    }
    });

  } catch (error) { 
    res.status(500).json({
      message: 'internal server error',
      error: error.message
    });
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
  

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    const id = req.user; 
    const user = await userModel.findById(id);

    const checkPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: 'Password does not match your current password'
      });
    }
    if (confirmPassword === checkPassword) {
      return res.status(400).json({
        message: 'You cannot use your previous password'
      });
    }
    const checkExisting = await bcrypt.compare(newPassword, user.password);
    if (checkExisting) {
      return res.status(400).json({
        message: 'You cannot use your previous password'
      });
    } 
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Password do not match'
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    await userModel.findByIdAndUpdate(user._id, { password: hash }, { new: true });
    
    res.status(200).json({
      message: 'Password changed successfully'
    });
   
  } catch (error) {
     res.status(500).json({
      message: 'internal server error' + error.message,
      error: error.message
    });
  }
};



exports.update = async (req, res) => {
  try {
    const {fullName, age} = req.body;
    const {id} = req.params;
    const file = req.file;
    let response;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json(`User not found`)
    }

    if (file && file.path) {
      await cloudinary.uploader.destroy(user.profilePicture.publicId)
      response = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path)
    }

    const userData = {
      fullName: fullName ?? user.fullName,
      age: age ?? user.age,
      profilePicture: {
        imageUrl: response?.secure_url,
        publicId: response?.public_id
      }
    }

    const newData = Object.assign(user, userData)
    const update = await userModel.findByIdAndUpdate(user._id, newData, {new: true});

    res.status(200).json({
      message: `User updated successfully`,
      data: update
    })
    
  } catch (error) {
   res.status(500).json({
     message: `Inernal Server Error`
})
}
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const file= req.file;
    
        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        if (file && file.path) {
            await cloudinary.uploader.destroy(user.profilePicture.publicId)
            fs.unlinkSync(user.profilePicture.publicId)
        }
        res.status(200).json({
            message: 'User deleted successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'internal server error' 
        });
    }
};
