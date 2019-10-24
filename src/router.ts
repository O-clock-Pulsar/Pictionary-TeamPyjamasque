import express from 'express';

import multer from 'multer';
import MainController from './controllers/mainController';
import RegistrationController from './controllers/registrationController';
import AuthController from './controllers/authController';
import { AvatarUploadHandler } from './middlewares/AvatarUploadHandler';
import GameController from './controllers/gameController';

const multerBodyParser = multer();

const router: express.Router = express.Router();

// on définit des routes
router.get('/', MainController.home);
router
  .route('/register')
  .get(RegistrationController.getRegister)
  .post(
    AvatarUploadHandler.single('avatar'),
    RegistrationController.postRegister,
  );
router
  .route('/login')
  .get(AuthController.getLogin)
  .post(multerBodyParser.none(),
    AuthController.postLogin);
router.get('/home',
  GameController.showGames);
router.get('/game/create',
  GameController.create);
router.get('/game/:namespace',
  GameController.play);
router.post(
  '/report-violation',
  multerBodyParser.none(),
  MainController.reportViolation,
);

export default router;
