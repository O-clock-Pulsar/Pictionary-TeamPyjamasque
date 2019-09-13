
import express from 'express';

import MainController from './controllers/mainController';
import RegistrationController from './controllers/registrationController';
import { AvatarUploadHandler } from './middlewares/AvatarUploadHandler'

const router: express.Router = express.Router();

// on définit des routes
router.get('/', MainController.home);
router.route('/register')
    .get(RegistrationController.getRegister)
    .post(AvatarUploadHandler.single('avatar'), RegistrationController.postRegister);


export default router;