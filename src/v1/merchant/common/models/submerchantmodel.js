const {model , Schema} = require('mongoose');

const subMerchantSchema = new Schema({
    name : {
        type : String ,
        required : true
    } ,
    number : {
        type : String ,
        required: true
    } ,
    email : {
        type : String ,
        required : true
    } ,
    branch : {
        type : String ,
        required : true
    } ,
    roles : {
        type : String , 
        required : true
    } ,
    mID : {
        type : String ,
        required :  true
    }
});

subMerchantSchema.index({name : 1});

const subMerchant = model('subMerchant', subMerchantSchema , 'submerchants');

module.exports = {
    submerchant : subMerchant
}