const services = require('../../../services/services');
const statusCodes = require("../../../others/statuscodes/statuscode");
const messages = require("../../../others/messages/messages");
const { merchant, brand, campaign, staff, submerchant } = require('../models/model');

module.exports = {
    listCampaign: async (req, res) => {
        await campaign.find().then((response) => {
            res.status(statusCodes.success).json({
                status: true,
                data: response,
                message: response ? "successfully showed campaign items" : messages.itemNotFount
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
    listCampaignByUser: async (req, res) => {
        let mID = req.query.mid;
        console.log(mID)
        await campaign.find({ mID: mID }).then((response) => {
            res.status(statusCodes.success).json({
                status: true,
                data: response,
                message: response.length ? "showed user campaign" : messages.itemNotFount
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

    addBasicCampaign: async (req, res) => {
        const Campaign = new campaign({
            basic_Details: {
                brand: req.body.brand,
                title: req.body.title,
                deliveryType: req.body.deliveryType,
                description: req.body.description
            },
            mID: req.body.mID
        });
        await services.validateRequestAndCreate(req, res, Campaign);
    },

    addCampaignPhotoDesc: async (req, res) => {
        let response;
        try {
            response = await campaign.findOne({ _id: req.query.id });
        } catch {

        }
        if (response == null) {
            res.status(statusCodes.notFound).json({
                status: false,
                error: statusCodes.notFound,
                message: messages.itemNotFount,
            });
        }
        else {
            let photosAndDescription = {
                "offer": req.body.offer,
                "deliverable": req.body.deliverable,
            }
            try {
                if (req.files.campaignImages) {
                    photosAndDescription.campaignImages = req.files.campaignImages[0].path;
                }
                if (req.files.coverImage) {
                    photosAndDescription.coverImage = req.files.coverImage[0].path;
                }
            } catch (err) {
                console.log(err);
            }

            await campaign.updateOne({ _id: req.query.id }, { $set: { photosAndDescription: photosAndDescription } }, { runValidators: true }).then((response) => {
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

    addCampaignDetails: async (req, res) => {
        const details = {
            genders: req.body.genders,
            followers: req.body.followers,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            excludedDays: req.body.excludedDays,
            startTime: req.body.startTime,
            endTime: req.body.endTime
        }
    
        // Check if the start date is before tomorrow
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(details.startDate);
        if (startDate < today) {
            return res.status(statusCodes.badRequest).json({
                status: false,
                message: 'Start date must be coming days.'
            });
        }
    
        // Check if the end date is after the start date
        const endDate = new Date(details.endDate);
        if (endDate <= startDate) {
            return res.status(statusCodes.badRequest).json({
                status: false,
                message: 'End date must be after the start date.'
            });
        }
    
        // Perform the database update
        try {
            const response = await campaign.findOneAndUpdate({ _id: req.query.id }, { $set: { details: details } }, { runValidators: true });
            res.status(statusCodes.success).json({
                status: response ? true : false,
                data: response,
                message: response ? messages.updatedSuccessfully : messages.itemNotFound
            });
        } catch (err) {
            const error = err.toString();
            res.status(statusCodes.internalServerError).json({
                status: false,
                message: messages.internalServerError,
                error: error
            });
        }
    },
    addCampaignSettings: async (req, res) => {

        let settings = {
            whatsappName: req.body.whatsappName,
            whatsappNumber: req.body.whatsappNumber,
            swipeLink: req.body.swipeLink,
            welcomeMessage: req.body.welcomeMessage,
            socialChannel: req.body.socialChannel
        }
        await campaign.findOneAndUpdate({ _id: req.query.id }, { $set: { settings: settings } }, { runValidators: true }).then((response) => {
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
    // API to get upcoming events (campaigns)
    getUpcomingEvents: async (req, res) => {
        try {
            const currentDate = new Date();
            const upcomingEvents = await campaign.find({
                'details.startDate': { $gte: currentDate }
            }).select('-photosAndDescription -settings -mID');
    
            res.status(200).json({ events: upcomingEvents });
        } catch (error) {
            console.error('Error in getUpcomingEvents:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    // API to get previous events (campaigns)
    getPreviousEvents: async (req, res) => {
        try {
            const currentDate = new Date();
            const previousEvents = await campaign.find({
                'details.endDate': { $lt: currentDate }
            }).select('-photosAndDescription -settings -mID');
    
            res.status(200).json({ events: previousEvents });
        } catch (error) {
            console.error('Error in getPreviousEvents:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}