
import express from 'express';

import MainController from './controllers/mainController';
import RegistrationController from './controllers/registrationController';
import AuthController from './controllers/authController';
import { AvatarUploadHandler } from './middlewares/AvatarUploadHandler'
import multer from 'multer';

const multerBodyParser = multer();

const router: express.Router = express.Router();

// on définit des routes
router.get('/', MainController.home);
router.route('/register')
    .get(RegistrationController.getRegister)
    .post(AvatarUploadHandler.single('avatar'), RegistrationController.postRegister);
router.route('/login')
    .get(AuthController.getLogin)
    .post(multerBodyParser.none(), AuthController.postLogin);

export default router;