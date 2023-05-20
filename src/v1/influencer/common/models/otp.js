const {model , Schema} = require('mongoose');

const otpSchema = new Schema ({
    otp: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
})

otpSchema.index({otp: 1});
const Otp = model('Otp', otpSchema , 'otps');

module.exports = {
    otp: Otp
}

