const router = require('express').Router();
const controller = require('../controllers/controller');
const services = require('../../../services/services')
const multer = require('multer');
const brandController = require('../controllers/brandController');
const campaignController = require('../controllers/campaignController');
const staffController = require('../controllers/staffController')
const bookingController = require('../controllers/bookingController')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
// const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'video/mp4') {
      cb(null, true);
      console.log('file type' , file.mimetype)
      console.log("file accepted and uploaded");
    } else {
        console.log('file type' , file.mimetype)
      cb(new Error('Invalid file type'), false);
    }
  };

  
const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 10 // 10MB file size limit
    },
    fileFilter: fileFilter
  });
  
router.route('/').get(controller.getMerchant);
router.route('/signup').post(controller.signUp);
router.route('/login').post(controller.login);
router.route('/update').patch(services.verifyMerchantToken ,controller.updateProfile);
router.route('/logout').patch(services.verifyMerchantToken ,controller.logOut);
router.route('/delete').delete(services.verifyMerchantToken ,controller.deleteAccount);


router.route('/brand/basic').post(upload.fields([{ name: 'logo', maxCount: 1 }]),brandController.addBasicBrand);
router.route('/brand/branch/').post(brandController.addBrandBranch);
router.route('/brand/description').post(upload.fields([{ name: 'file', maxCount: 1 }]),brandController.addBrandDesc);
router.route('/brands').get(brandController.listBrands)
router.route('/brands/user/').get(brandController.listBrandsByUser)

router.route('/add/campaign').post(services.verifyMerchantToken ,upload.fields([{ name: 'campaignImages', maxCount: 4 }, { name: 'coverImage', maxCount: 1 }]),controller.addCampaign);
router.route('/campaign/basic').post(campaignController.addBasicCampaign);
router.route('/campaign/photoDescription').post(upload.fields([{ name: 'campaignImages', maxCount: 4 }, { name: 'coverImage', maxCount: 1 }]),campaignController.addCampaignPhotoDesc);
router.route('/campaign/details').post(campaignController.addCampaignDetails);
router.route('/campaign/settings').post(campaignController.addCampaignSettings);
router.route('/campaign').get(campaignController.listCampaign)
router.route('/campaign/user/').get(campaignController.listCampaignByUser)
router.route('/upcoming-events').get(campaignController.getUpcomingEvents);
router.route('/previous-events').get(campaignController.getPreviousEvents);



router.post('/staff', staffController.createStaff);
router.get('/staff', staffController.getAllStaff);
router.get('/staff/user/', staffController.getStaffByMID);
router.get('/staff/:id', staffController.getStaffById);
router.put('/staff/:id', staffController.updateStaffById);
router.delete('/staff/:id', staffController.deleteStaffById);

router.post('/booking', bookingController.bookInfluencerForCampaign);
router.get('/influencer/:influencerId/campaigns', bookingController.findCampaignsByInfluencerId);
router.get('/campaign/:campaignId/influencers', bookingController.findInfluencersByCampaignId);
router.put('booking/cancel/:bookingId', bookingController.cancelBooking);

module.exports = router;



router.route('/add/submerchant').post(services.verifyMerchantToken ,controller.addSubMerchant);
router.route('/get/details').get(controller.getAllDetails);
// router.post('/add/brand/', upload.fields([{name : 'logo', maxCount : 1} , {name : 'file', maxCount : 1}] , controller.addBrand))
module.exports = router