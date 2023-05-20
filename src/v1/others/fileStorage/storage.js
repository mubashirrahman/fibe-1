const multer =require('multer');

const storage = multer.memoryStorage({
    destination: function (req , file, cb){
        cb(null ,'');
    }
});

module.exports = storage