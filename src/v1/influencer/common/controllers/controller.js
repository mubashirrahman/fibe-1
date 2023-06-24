const services = require('../../../services/services');
const { influencer, otp } = require("../models/model");
const dotenv = require("dotenv");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const statusCodes = require("../../../others/statuscodes/statuscode");
const messages = require("../../../others/messages/messages");

module.exports = {
  listInfluencers: async (req, res) => {
    await influencer.find({}, { iID: 1, phone: 1, name: { $concat: ["$firstName", " ", "$lastName"] }, email: 1, country: 1, city: 1 }).then((response) => {
      res.status(statusCodes.success).json({
        status: true,
        data: response,
        message: messages.created
      });
    }).catch((err) => {
      const error = err.toString();
      res.status(statusCodes.internalServerError).json({
        status: false,
        error: error,
        message: messages.internalServerError
      });
    })
  },
  getInfluencer: async (req, res) => {
    const user = await services.getUserById(influencer, req.params.id);
    if (user != null) {
      try {
        res.status(statusCodes.success).json({
          status: true,
          data: user
        })
      }
      catch (err) {
        const error = err.toString();
        res.status(statusCodes.internalServerError).json({
          status: false,
          message: messages.internalServerError,
          error: error
        })
      }
    } else {
      res.status(statusCodes.notFound).json({
        status: false,
        message: messages.userNotFound
      });
    }
  },

  signUp: async (req, res) => {
    req.body.token = "";
    const response = await influencer.findOne({ phone: req.body.phone });
    if (response) {
      res.status(statusCodes.alreadyExists).json({
        status: false,
        error: statusCodes.alreadyExists,
        message: messages.alreadyExists,
      });
    } else {
      req.body.iID = uuidv4();
      const user = new influencer(req.body);
      services.validateRequestAndCreate(req, res, user);
    }
  },



  generateOtp: async (req, res) => {
    const user = await influencer.findOne({
      phone: req.body.phone,
    });
    if (!user) {
      return res.status(404).json({
        message: "No account linked to this mobile number",
      });
    } else {
      let Otp = "0000"
      var unhashedOtp = Otp;
      const salt = await bcrypt.genSalt(10);
      //  Otp = await bcrypt.hash(Otp , salt);
      const credential = new otp({ phone: req.body.phone, otp: Otp });
      await credential.save().then(async (response) => {
        await services.sendSms(req.body.phone, unhashedOtp);
        res.status(statusCodes.created).json({
          status: true,
          message: messages.genOtp,
          data: response
        });
      }).catch((err) => {
        const error = err.toString();
        let statusCode = err.response ? err.response.status : err.statusCode || statusCodes.internalServerError;
        let errorMessage = err.message || messages.internalServerError
        res.status(statusCode).json({
          status: false,
          message: errorMessage
        });
      })
    }
  },
  verifyOtp: async (req, res) => {
    console.log(req.body);
    const response = await otp.find({ phone: req.body.phone });
    console.log('response is ', response)
    if (response.length === 0) {
      res.status(statusCodes.invalid).json({
        status: false,
        message: messages.invalidOtp
      })
    } else {
      const validOtp = response[response.length - 1];
      console.log(validOtp);
      const isValidUser = await bcrypt.compare(req.body.otp, validOtp.otp);
      if (validOtp.phone === req.body.phone && isValidUser) {
        let user = await influencer.find({ phone: validOtp.phone });
        var iid = user.iID
        console.log('user iss', user[0].iID);
        const token = await services.generateToken(user);
        await influencer.updateOne({ phone: req.body.phone }, { token: token });
        await otp.deleteMany({ phone: req.body.phone });
        res.status(statusCodes.success).json({
          status: true,
          message: messages.loginSuccess,
          iid: user[0].iID,
          token: token
        })
      } else {
        res.status(statusCodes.authorizatiionError).json({
          status: false,
          message: messages.unauthorized
        })
      }
    }
  },
  updateProfile: async (req, res) => {
    const user = await services.getUserById(influencer, req.query.id);
    //console.log(user)
    if (user != null) {
      await influencer.updateOne({ _id: req.query.id }, { $set: req.body }).then((response) => {
        res.status(statusCodes.success).json({
          status: true,
          message: messages.updatedSuccessfully,
          data: response
        })
      }).catch((err) => {
        const error = err.toString();
        res.status(statusCodes.internalServerError).json({
          status: false,
          message: messages.internalServerError,
          error: error
        })
      })
    } else {
      res.status(statusCodes.notFound).json({
        status: false,
        message: messages.userNotFound
      });
    }
  },

  logOut: async (req, res) => {
    await influencer.updateOne({ phone: req.body.phone }, { token: "" }).then((response) => {
      res.status(statusCodes.success).json({
        status: true,
        message: messages.loggOutSuccess,
        data: response
      })
    }).catch((err) => {
      const error = err.toString();
      res.status(statusCodes.internalServerError).json({
        status: false,
        message: messages.internalServerError,
        error: error
      });
    })
  },
  deleteAccount: async (req, res) => {
    const response = await influencer.find({ phone: req.body.phone });
    if (response.length === 0) {
      res.status(statusCodes.notFound).json({
        status: false,
        message: messages.userNotFound
      })
    } else {
      await influencer.deleteOne({ phone: req.body.phone }).then((response) => {
        res.status(statusCodes.success).json({
          status: true,
          message: messages.userDeleted,
          data: response
        })
      })
    }
  },
  setSocialmedia: async (req, res) => {
    const user = await services.getUserById(influencer, req.query.id);
    console.log(user)
    if (user != null) {
      await influencer.updateOne({ _id: req.query.id }, { $set: req.body }).then((response) => {
        res.status(statusCodes.success).json({
          status: true,
          message: messages.updatedSuccessfully,
          data: response
        })
      }).catch((err) => {
        const error = err.toString();
        res.status(statusCodes.internalServerError).json({
          status: false,
          message: messages.internalServerError,
          error: error
        })
      })
    } else {
      res.status(statusCodes.notFound).json({
        status: false,
        message: messages.userNotFound
      });
    }

  },

  changeCity: async (req, res) => {
    const user = await services.getUserById(influencer, req.query.id);
    if (user != null) {
      let city = req.body.city || '';
      await influencer.updateOne({ _id: req.query.id }, { $set: { city: city } }, { runValidators: true }).then((response) => {
        res.status(statusCodes.success).json({
          status: true,
          message: messages.updatedSuccessfully,
          data: response
        })
      }).catch((err) => {
        const error = err.toString();
        res.status(statusCodes.internalServerError).json({
          status: false,
          message: messages.internalServerError,
          error: error
        })
      })
    } else {
      res.status(statusCodes.notFound).json({
        status: false,
        message: messages.userNotFound,
      });
    }

  },
  setViewcount: async (req, res) => {
    const user = await services.getUserById(influencer, req.query.id);
    if (user != null) {
      let viewCount = req.body.viewCount || null;
      await influencer.updateOne({ _id: req.query.id }, { $set: { viewCount: viewCount } }, { runValidators: true }).then((response) => {
        res.status(statusCodes.success).json({
          status: true,
          message: messages.updatedSuccessfully,
          data: response
        })
      }).catch((err) => {
        const error = err.toString();
        res.status(statusCodes.internalServerError).json({
          status: false,
          message: messages.internalServerError,
          error: error
        })
      })
    } else {
      res.status(statusCodes.notFound).json({
        status: false,
        message: messages.userNotFound,
      });
    }

  },
  setStatus: async (req, res) => {
    const user = await services.getUserById(influencer, req.query.id);
    if (user != null) {
      let status = req.body.status || '';
      await influencer.updateOne({ _id: req.query.id }, { $set: { status: status } }, { runValidators: true }).then((response) => {
        res.status(statusCodes.success).json({
          status: true,
          message: messages.updatedSuccessfully,
          data: response
        })
      }).catch((err) => {
        const error = err.toString();
        res.status(statusCodes.internalServerError).json({
          status: false,
          message: messages.internalServerError,
          error: error
        })
      })
    } else {
      res.status(statusCodes.notFound).json({
        status: false,
        message: messages.userNotFound,
      });
    }
  }
};
