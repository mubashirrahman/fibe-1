const services = require('../../../services/services');
const statusCodes = require("../../../others/statuscodes/statuscode");
const messages = require("../../../others/messages/messages");
const { merchant, brand, campaign, staff, submerchant } = require('../models/model');

module.exports = {
    listBrands: async (req, res) => {
        await brand.find().then((response) => {
            res.status(statusCodes.success).json({
                status: true,
                data: response,
                message: response ? "successfully showed brand items" : messages.itemNotFount
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
    listBrandsByUser: async (req, res) => {
        let mID = req.query.mid;
        console.log(mID)
        await brand.find({ mID: mID }).then((response) => {
            res.status(statusCodes.success).json({
                status: true,
                data: response,
                message: response.length ? "showed user brands" : messages.itemNotFount
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

    addBasicBrand: async (req, res) => {
        let basic_Information = {
            brandName: req.body.brandName,
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
        const branch_Information = {
            branchName: req.body.branchName,
            contactName: req.body.contactName,
            contactNumber: req.body.contactNumber,
            country: req.body.country,
            location: req.body.location
        }
        await brand.findOneAndUpdate({ _id: req.query.id }, { $set: { branch_Information: branch_Information } }, { runValidators: true }).then((response) => {
            res.status(statusCodes.success).json({
                status: response ? true : false,
                data: response,
                message: response ? messages.updatedSuccessfully : messages.itemNotFount
            })
        }).catch((err) => {
            const error = err.toString();
            res.status(statusCodes.internalServerError).json({
                status: false,
                message: messages.internalServerError,
                error: error
            })
        })
    },

    addBrandDesc: async (req, res) => {
        let response;
        try {
            response = await brand.findOne({ _id: req.query.id });
        } catch { }
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

    }
}