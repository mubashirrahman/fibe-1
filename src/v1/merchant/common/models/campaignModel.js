const {model , Schema} = require('mongoose');


const basicSchema = new Schema({
    brand : {
        type : String ,
        required : true
    } , 
    title : {
        type : String ,
        required : true
    } ,
    branch : {
        type : String ,
        required : true
    } , 
    type : {
        type : String , 
        required : true
    } , 
    description : {
        type : String ,
        required : true
    }
});

const photoSchema = new Schema({
    offer : {
        type : String ,
        required:  true
    } ,
    deliverable : {
        type : String ,
        required :  true
    } ,
    campaignImages : {
        type : String , 
        required : true
    } , 
    coverImage : {
        type :String ,
        required :  true
    }
});

const detailsSchema = new Schema({
    genders : {
        type : String,
        required: true
    } ,
    followers : {
        type : String ,
        required : true
    } ,
    startDate : {
        type : String ,
        required : true 
    } ,
    endDate : {
        type : String ,
        required : true
    } ,
    excludedDays : {
        type : Array , 
        required : true
    } ,
    startTime : {
        type : String ,
        required : true
    } ,
    endTime : {
        type : String ,
        required : true
    } 
});

const settingsSchema = new Schema({
    branch : {
        type : String ,
        required : true
    } ,
    chat : {
        type : Boolean ,
        required : true
    } ,
    whatsappName : {
        type : String ,
        required :  true
    } ,
    whatsappNumber : {
        type : String ,
        required : true
    } ,
     swipeLink : {
        type : String ,
        required : true
     } ,
     welcomeMessage : {
        type : String ,
        required : true
     } ,
     socialChannel : {
        type :  String
     }

});

const campaignSchema = new Schema({
    basic_Details : {
        type : basicSchema , 
        required : true
    } ,
    photosAndDescription : {
        type : photoSchema , 
        required : true
    } ,
    details : {
        type : detailsSchema ,
        required : true
    } , 
    settings : {
        type : settingsSchema ,
        required : true
    } ,
    mID: {
        type : String ,
        required : true
    }
});

campaignSchema.index({basic_Details : 1});
const Campaign = model('Campaign' , campaignSchema , 'campaigns');
module.exports = {
    campaign : Campaign
}
