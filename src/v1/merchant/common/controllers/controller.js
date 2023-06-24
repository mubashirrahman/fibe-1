const services = require('../../../services/services');
const dotenv = require("dotenv");
const bcrypt = require('bcrypt');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
// const storage = require('../../../others/fileStorage/storage');
const statusCodes = require("../../../others/statuscodes/statuscode");
const messages = require("../../../others/messages/messages");
const { merchant, brand, campaign, staff, submerchant } = require('../models/model');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'video/mp4') {
    cb(null, true);
    console.log("file accepted and uploaded");
  } else {
    cb(new Error('Invalid file type'), false);
  }
};


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB file size limit
  },
  fileFilter: fileFilter
});


module.exports = {
  signUp: async (req, res) => {
    console.log(req.body);
    req.body.token = ''
    const response = await merchant.findOne({ email: req.body.email });
    if (response) {
      res.status(statusCodes.alreadyExists).json({
        status: false,
        error: statusCodes.alreadyExists,
        message: messages.alreadyExists,
      });
    } else {
      //   const salt = await bcrypt.genSalt(10);
      //   req.body.password = await bcrypt.hash(req.body.password , salt);
      req.body.mID = uuidv4();
      const user = new merchant(req.body);
      services.validateRequestAndCreate(req, res, user);
    }
  },

  login: async (req, res) => {
    try {
      console.log('req.body', req.body)
      const response = await merchant.findOne({ email: req.body.email });
      console.log('merchant is', response);
      if (response === null) {
        res.status(statusCodes.notFound).json({
          status: false,
          message: messages.userNotFound
        });
      } else {
        const valid = await bcrypt.compare(req.body.password, response.password);
        if (valid) {
          const token = await services.generateToken(response);
          await merchant.updateOne({ email: req.body.email }, { token: token });
          res.status(statusCodes.success).json({
            status: true,
            message: messages.updatedSuccessfully,
            mid: response.mID,
            token: token
          });
        } else {
          res.status(statusCodes.authorizatiionError).json({
            status: false,
            message: messages.passwordError
          })
        }
      }
    } catch (err) {
      const error = err.toString();
      res.status(statusCodes.internalServerError).json({
        status: false,
        message: messages.internalServerError,
        error: error
      })
    }
  },
  updateProfile: async (req, res) => {
    const user = await services.getUserById(merchant, req.query.id);
    console.log(user)
    if (user != null) {
      await merchant.updateOne({ _id: req.query.id }, { $set: req.body }).then((response) => {
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
    await merchant.updateOne({ _id: req.query.id }, { token: "" }).then((response) => {
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
    const response = await merchant.find({ _id: req.query.id });
    if (response.length === 0) {
      res.status(statusCodes.notFound).json({
        status: false,
        message: messages.userNotFound
      })
    } else {
      await merchant.deleteOne({ _id: req.query.id }).then((response) => {
        res.status(statusCodes.success).json({
          status: true,
          message: messages.userDeleted,
          data: response
        })
      })
    }
  },


  addBrand: async (req, res) => {
    // console.log('request is' , req.file)
    // console.log('files are' , Object.keys(req.files));
    // const {logo , file} = req.files;
    // console.log('files separate', req.files.file[0].path)
    // console.log('logo and file', logo , file);
    const Brand = new brand({
      basic_Information: {
        logo: req.files.logo[0].path,
        // assuming the logo file was uploaded as a single file with name 'logo'
        instagram: req.body.instagram,
        orderLink: req.body.orderLink,
        deliveryZone: req.body.deliveryZone
      },
      branch_Information: {
        branchName: req.body.branchName,
        contactName: req.body.contactName,
        contactNumber: req.body.contactNumber,
        country: req.body.country,
        location: req.body.location
      },
      description: {
        campaignPin: req.body.campaignPin,
        category: req.body.category,
        description: req.body.description,
        // file:req.files.file[0].path 
        // assuming the description file was uploaded as a single file with name 'descriptionField1'
      },
      mID: req.body.mID
    });

    await services.validateRequestAndCreate(req, res, Brand);
  },

  addBasicBrand: async (req, res) => {
    let basic_Information = {
      instagram: req.body.instagram,
      orderLink: req.body.orderLink,
      deliveryZone: req.body.deliveryZone
    }
    try {
      if (req.files.logo) {
        basic_Information.logo = req.files.logo[0].path;
      }
    }
    catch { }
    const Brand = new brand({
      basic_Information,
      mID: req.body.mID
    })
    await services.validateRequestAndCreate(req, res, Brand);
  },

  addBrandBranch: async (req, res) => {

    const response = await brand.findOne({ _id: req.query.id });
    if (response == null) {
      res.status(statusCodes.notFound).json({
        status: false,
        error: statusCodes.notFound,
        message: messages.itemNotFount,
      });
    }
    else {
      const branch_Information = {
        branchName: req.body.branchName,
        contactName: req.body.contactName,
        contactNumber: req.body.contactNumber,
        country: req.body.country,
        location: req.body.location
      }

      await brand.updateOne({ _id: req.query.id }, { $set: { branch_Information: branch_Information } }, { runValidators: true }).then((response) => {
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
    }
  },

  addBrandDesc: async (req, res) => {
    const response = await brand.findOne({ _id: req.query.id });
    if (response == null) {
      res.status(statusCodes.notFound).json({
        status: false,
        error: statusCodes.notFound,
        message: messages.itemNotFount,
      });
    }
    else {

      let description = {
        campaignPin: req.body.campaignPin,
        category: req.body.category,
        description: req.body.description,

        // assuming the description file was uploaded as a single file with name 'descriptionField1'
      }
      try {

        if (req.files.file) {
          description.file = req.files.file[0].path;
        }
      } catch { }

      await brand.updateOne({ _id: req.query.id }, { $set: { description: description } }, { runValidators: true }).then((response) => {
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
    }

  },

  listBrands: async (req, res) => {
    await brand.find().then((response) => {
      res.status(statusCodes.success).json({
        status: true,
        data: response,
        message: response ? messages.itemNotFount : "successfully showed brand items"
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


  addCampaign: async (req, res) => {
    const Campaign = new campaign({
      basic_Details: {
        brand: req.body.brand,
        title: req.body.title,
        branch: req.body.branch,
        type: req.body.type,
        description: req.body.description
      },
      photosAndDescription: {
        offer: req.body.offer,
        deliverable: req.body.deliverable,
        campaignImages: req.files.campaignImages[0].path,
        coverImage: req.files.coverImage[0].path
      },
      details: {
        genders: req.body.genders,
        followers: req.body.followers,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        excludedDays: req.body.excludedDays,
        startTime: req.body.startTime,
        endTime: req.body.endTime
      },
      settings: {
        branch: req.body.settingsBranch,
        chat: req.body.chat,
        whatsappName: req.body.whatsappName,
        whatsappNumber: req.body.whatsappNumber,
        swipeLink: req.body.swipeLink,
        welcomeMessage: req.body.welcomeMessage,
        socialChannel: req.body.socialChannel
      },
      mID: req.body.mID
    });
    await services.validateRequestAndCreate(req, res, Campaign);
  },

  addStaff: async (req, res) => {
    try {
      console.log('request data', req.body);
      const Staff = new staff(req.body);
      await services.validateRequestAndCreate(req, res, Staff);
    } catch (err) {
      const error = err.toString();
      res.status(statusCodes.internalServerError).json({
        status: false,
        error: error,
        message: messages.internalServerError
      });
    }
  },

  addSubMerchant: async (req, res) => {
    try {
      console.log('request data', req.body);
      const subMerchant = new submerchant(req.body);
      await services.validateRequestAndCreate(req, res, subMerchant);
    } catch (err) {
      const error = err.toString();
      res.status(statusCodes.internalServerError).json({
        status: false,
        error: error,
        message: messages.internalServerError
      });
    }
  },
  getAllDetails: async (req, res) => {
    console.log('mID', req.query.mID);
    await merchant.aggregate([
      {
        $match: { mID: req.query.mID } // Replace <mID> with the ID of the merchant you want to aggregate
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'mID',
          foreignField: 'mID',
          as: 'brands'
        }
      },
      {
        $lookup: {
          from: 'campaigns',
          localField: 'mID',
          foreignField: 'mID',
          as: 'campaigns'
        }
      },
      {
        $lookup: {
          from: 'staffs',
          localField: 'mID',
          foreignField: 'mID',
          as: 'staffs'
        }
      },
      {
        $lookup: {
          from: 'submerchants',
          localField: 'mID',
          foreignField: 'mID',
          as: 'submerchants'
        }
      },
      {
        $unwind: '$brands'
      },
      {
        $unwind: '$campaigns'
      },
      {
        $unwind: '$staffs'
      },
      {
        $unwind: '$submerchants'
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          totalClicks: { $sum: '$campaigns.clicks' },
          campaigns: { $push: '$campaigns' },
          brands: { $push: '$brands' },
          staffs: { $push: '$staffs' },
          submerchants: { $push: '$submerchants' }
        }
      }
    ]).then((response) => {
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
  }

}