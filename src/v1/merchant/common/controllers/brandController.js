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
    // Update Basic Brand API
    updateBasicBrand: async (req, res) => {
        const { brandName, instagram, orderLink, deliveryZone } = req.body;
        const { brandId } = req.query; // Assuming you get the brandId from the URL params

        try {
            // Check if the brand exists in the database
            const existingBrand = await brand.findById(brandId);
            if (!existingBrand) {
                return res.status(404).json({ error: 'Brand not found' });
            }

            // Update the basic information fields if they are provided in the request
            if (brandName) {
                existingBrand.basic_Information.brandName = brandName;
            }
            if (instagram) {
                existingBrand.basic_Information.instagram = instagram;
            }
            if (orderLink) {
                existingBrand.basic_Information.orderLink = orderLink;
            }
            if (deliveryZone) {
                existingBrand.basic_Information.deliveryZone = deliveryZone;
            }

            // Check if the request contains the 'logo' file and update it if needed
            if (req.files && req.files.logo) {
                existingBrand.basic_Information.logo = req.files.logo[0].path;
            }

            // Save the updated brand information
            await existingBrand.save();

            // Respond with the updated brand object
            res.json(existingBrand);
        } catch (error) {
            console.error('Error updating brand:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    // Delete Brand API
    deleteBrand: async (req, res) => {
        const { brandId } = req.query; // Assuming you get the brandId from the URL params

        try {
            // Check if the brand exists in the database
            const existingBrand = await brand.findById(brandId);
            if (!existingBrand) {
                return res.status(404).json({ error: 'Brand not found' });
            }

            // Delete the brand from the database
            await existingBrand.deleteOne()

            // Respond with a success message
            res.json({ message: 'Brand deleted successfully' });
        } catch (error) {
            console.error('Error deleting brand:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
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