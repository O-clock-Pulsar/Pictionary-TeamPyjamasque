// importer les variables d'environnement
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import 'reflect-metadata';
import flash from 'express-flash-notification';
import cookieParser from 'cookie-parser';
import Server from './services/SocketIOServer';
import AuthChecker from './middlewares/AuthChecker';
import router from './router';
import helmet from './middlewares/Helmet';
import FlashSettings from './middlewares/FlashSettings';
import session from './middlewares/Session';
import pageNotFound from './middlewares/PageNotFound';

const app: express.Express = express();
const PORT = process.env.PORT || 5050;
const SOCKET_PORT = process.env.SOCKET_IO_PORT || 5060;
const socketServer = new Server(SOCKET_PORT);

socketServer.start();

// app.use(helmet);

dotenv.config();

app.use(cookieParser(process.env.COOKIE_SECRET || 'dummy'));

app.use(session);

app.use(flash(app,
  FlashSettings));

// setup view engine
app.set('views',
  'views');
app.set('view engine',
  'pug');

app.use(express.static('public'));
app.use('/react',
  express.static('public/react'));

// Middlewares moved morgan into if for clear tests
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(AuthChecker);

// routing
app.use(router);

/*
 * middleware pour les 404 !
 * app.use(pageNotFound);
 */

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/odraw',
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Mongoose connected');

    // lancer l'appli
    app.listen(PORT,
      () => {
        console.log(`App running on port ${PORT}`);
      });
  });
