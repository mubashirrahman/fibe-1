const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config()
const statusCodes = require("../others/statuscodes/statuscode");
const messages = require("../others/messages/messages");
const otpGenerator = require('otp-generators');
const { merchant } = require("../merchant/common/models/model");
const {influencer} = require('../influencer/common/models/model')
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const source = process.env.TWILIO_NUMBER;
const client = require('twilio')(accountSid,authToken);

module.exports = {
  generateToken: async (data) => {
    console.log("data is", data);
    return jwt.sign({ data }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
  },

 verifyUserToken : async (req, res, next) => {
  try {
      const token = req.headers.token;
      if (!token) {
          res.status(statusCodes.authorizatiionError).json({
            status : false ,
              message: messages.unauthorized
          })
      } else {
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const response =  await influencer.findOne({phone:decoded.phone});
        if(response){
          next();
        }else{
          res.status(statusCodes.invalid).json({
            status : false ,
            message : messages.expiredOrInvalidToken
          });
        }
      }

  } catch (err) {
      const error = new Error(err)
      error.status = 500
      return next(error)
  }
},
verifyMerchantToken : async (req, res, next) => {
  try {
      const token = await req.headers.token;
      if (!token) {
          res.status(statusCodes.authorizatiionError).json({
            status : false ,
              message: messages.unauthorized
          })
      } else {
        console.log(process.env.JWT_SECRET_KEY)
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("decoded" , decoded);
        const response =  await merchant.findOne({email:decoded.data.email});
        console.log('response', response);
        if(response){
          next();
        }else{
          res.status(statusCodes.invalid).json({
            status : false ,
            message : messages.expiredOrInvalidToken
          });
        }
      }

  } catch (err) {
      const error = new Error(err)
      error.status = 500
      return next(error)
  }
},


  validateRequestAndCreate: async (req, res, user) => {
    await user
      .validate()
      .then(async () => {
        await user
          .save()
          .then((response) => {
            res.status(statusCodes.created).json({
              status: true,
              message: messages.created,
              data: response,
            });
          })
          .catch((err) => {
            const statusCode = err.status || statusCodes.internalServerError;
            const message = err.message || messages.internalServerError;
            res.status(statusCode).json({
              status: false,
              message: message,
            });
          });
      })
      .catch((err) => {
        error = err.toString();
        res.status(statusCodes.badRequest).json({
          status: false,
          error: error,
          message: messages.badRequest,
        });
      });
  },
  generateOtp : async ()=>{
    const OTP = otpGenerator.generate(4, {
      alphabets: false,
      upperCase: false,
      specialChar: false,
    });
    return OTP
  },
  sendSms : async (number , otp)=>{
      client.messages.create({
        body:`Your OTP to login for FIBE is ${otp}`,
        from: source,
        to:`+91${number}`
      }).then((message)=>{
        console.log(message.status);
      })
  } , 
  getUserById : async (model , id) =>{
    const response = await model.findOne({_id : id});
    return response
  } , 
  
};
