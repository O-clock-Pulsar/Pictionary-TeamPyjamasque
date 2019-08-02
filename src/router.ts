
import express from 'express';

import MainController from './controllers/mainController';

const router: express.Router = express.Router();


// on définit des routes
router.get('/', MainController.home);


export default router;