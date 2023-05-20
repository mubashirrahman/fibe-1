const {model , Schema} = require('mongoose');
const {brand} = require('../models/brandModel');
const {campaign} = require('../models/campaignModel');
const {staff} = require('../models/staffModel');
const {submerchant} = require('../models/submerchantmodel');

const merchantSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String , 
        required : true
    },
    company : {
        type : String , 
        required : true
    } , 
    contact : {
        type : String , 
        required : true
    },
    password : {
        type : String , 
        required :true
    },
    mID : {
        type : String ,
        required :  true
    } ,
    token : {
        type : String
    },
}, {timestamps : true});

merchantSchema.index({email : 1});
const Merchant = model('Merchant',merchantSchema,'merchants');

module.exports = {
    merchant : Merchant ,
    brand :  brand ,
    campaign : campaign ,
    staff : staff ,
    submerchant : submerchant
}