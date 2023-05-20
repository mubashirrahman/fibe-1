const {model , Schema} = require('mongoose');

const fileSchema = new Schema({
    file : {
        data : String ,
       
    }
});

const basicSchema = new Schema({
    logo : {
        type : String,
        required: true
    },
    instagram : {
        type : String ,
        required : true
    } ,
    orderLink : {
        type : String ,
    } ,
    deliveryZone : {
        type : String 
    }
});

const branchSchema = new Schema({
    branchName : {
        type : String , 
        required: true
    } ,
    contactName : {
        type :String ,
        required: true
    } ,
    contactNumber : {
        type : String ,
        requied : true
    } ,
    country : {
        type : String ,
        requied : true
    } ,
    location : {
        type :String ,
        required : true
    }
});

const descriptionSchema = new Schema({
    campaignPin : {
        type : String ,
        required : true
    } ,
    category : {
        type : String ,
        required : true
    } ,
    description : {
        type : String
    } ,
    file : {
        type : String, 
        required : true
    }
}) ;

const brandSchema = new Schema({
    basic_Information : {
        type :basicSchema ,
        required :true
    },
    branch_Information : {
        type : branchSchema ,
        required : true
    } ,
    description : {
        type : descriptionSchema, 
        required : true
    } ,
    mID : {
        type : String ,
        required : true
    }
}) ;

brandSchema.index({basic_Information : 1});

const Brand = model('Brand' , brandSchema , 'brands');

module.exports = {
    brand : Brand
}