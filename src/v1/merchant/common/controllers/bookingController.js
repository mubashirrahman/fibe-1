const Booking = require('../models/bookingModel');

// API to book an influencer for a campaign
async function bookInfluencerForCampaign(req, res) {
    try {
        const { influencerId, campaignId, bookingDate } = req.body;

        // Add validation for influencerId and campaignId here if needed
        const currentDate = new Date();
        const booking = new Booking({
            influencer: influencerId,
            campaign: campaignId,
            bookingDate: bookingDate || currentDate
        });


        const existingBooking = await Booking.findOne({
            influencer: influencerId,
            campaign: campaignId,
        });
        if (existingBooking) {
            return res.status(409).json({ error: 'Influencer is already booked for this campaign' });
        }

        await booking.save();

        res.status(201).json({ message: 'Booking successful', booking });
    } catch (error) {
        console.error('Error in bookInfluencerForCampaign:', error);
        res.status(500).json({ error: error.message });
    }
}

// API to find all campaigns booked by an influencer
async function findCampaignsByInfluencerId(req, res) {
    try {
        const { influencerId } = req.params;

        // Add validation for influencerId here if needed

        const bookings = await Booking.find({ influencer: influencerId })
            .populate('campaign', 'basic_Details.title');

        res.status(200).json({ bookings });
    } catch (error) {
        console.error('Error in findCampaignsByInfluencerId:', error);
        res.status(500).json({ error: error.message });
    }
}

// API to find all influencers booked for a campaign
async function findInfluencersByCampaignId(req, res) {
    try {
        const { campaignId } = req.params;

        // Add validation for campaignId here if needed

        const bookings = await Booking.find({ campaign: campaignId })
            .populate('influencer', 'firstName lastName');

        res.status(200).json({ bookings });
    } catch (error) {
        console.error('Error in findInfluencersByCampaignId:', error);
        res.status(500).json({ error: error.message });
    }
}

// API to cancel a booking
async function cancelBooking(req, res) {
    try {
        const { bookingId } = req.params;

        // Add validation for bookingId here if needed

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: 'cancelled' },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        console.error('Error in cancelBooking:', error);
        res.status(500).json({ error: error.message });
    }
}

// Other necessary APIs can be added here

module.exports = {
    bookInfluencerForCampaign,
    findCampaignsByInfluencerId,
    findInfluencersByCampaignId,
    cancelBooking
};
