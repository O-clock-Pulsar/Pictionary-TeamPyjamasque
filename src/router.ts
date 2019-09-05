
import express from 'express';

import MainController from './controllers/mainController';
import RegistrationController from './controllers/registrationController';
import bodyParser from 'body-parser';

const router: express.Router = express.Router();
const urlencodedParser = bodyParser.urlencoded({extended: true});


// on définit des routes
router.get('/', MainController.home);
router.route('/register')
    .get(RegistrationController.getRegister)
    .post(urlencodedParser, RegistrationController.postRegister);


export default router;