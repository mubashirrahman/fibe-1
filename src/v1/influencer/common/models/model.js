const { model, Schema } = require('mongoose');
const { otp } = require('./otp');

const socialSchema = new Schema({
    instagram: {
        type: String
    },
    tiktok: {
        type: String
    },
    snapchat: {
        type: String
    },
    youtube: {
        type: String
    }
});

const influencerSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    iID: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    viewCount: {
        type: Number
    },
    status: {
        type: String,
        default:"Active",
        required:true
    },
    socialLinks: socialSchema
}, { timestamps: true });

influencerSchema.index({ phone: 1 }, { unique: true });
const Influencer = model('Influencer', influencerSchema, 'influencers');

module.exports = {
    influencer: Influencer,
    otp: otp
}