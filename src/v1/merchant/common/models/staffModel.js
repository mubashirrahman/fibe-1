const {model , Schema} = require('mongoose');

const staffSchema = new Schema({
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

staffSchema.index({name : 1});

const Staff = model('Staff', staffSchema , 'staffs');

module.exports = {
    staff : Staff
}