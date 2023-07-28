const { model, Schema } = require('mongoose');

const bookingSchema = new Schema({
    influencer: {
        type: Schema.Types.ObjectId,
        ref: 'Influencer',
        required: true
    },
    campaign: {
        type: Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed'
    }
}, { timestamps: true });

const Booking = model('Booking', bookingSchema, 'bookings');
module.exports = Booking;
