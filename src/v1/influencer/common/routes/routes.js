const router = require('express').Router();
const controller = require('../controllers/controller');
const services = require('../../../services/services');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/profile').post((req, res, next) => {
    upload.fields([{ name: 'profile' }])(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // MulterError: Unexpected field
            return res.status(400).json({
                error: 'Unexpected field in the request. Make sure to use the correct field name profile.',
            });
        }
        next();
    });
}, controller.addProfilePicture);
router.route('/profile').delete(controller.deleteProfilePicture)
router.route('/').get(controller.listInfluencers);
router.route('/:id').get(controller.getInfluencer)
router.route('/signup').post(controller.signUp);
router.route('/generateotp').post(controller.generateOtp);
router.route('/login').post(controller.verifyOtp);
router.route('/logout').patch(services.verifyUserToken, controller.logOut);
router.route('/delete').delete(services.verifyUserToken, controller.deleteAccount);
router.route('/update').patch(controller.updateProfile);
router.route('/socialmedia').post(controller.setSocialmedia);
router.route('/changecity').post(controller.changeCity);
router.route('/viewcount').post(controller.setViewcount);
router.route('/setstatus').post(controller.setStatus);
router.route('/whatsapp').post(controller.verifyWhatsapp);

module.exports = router