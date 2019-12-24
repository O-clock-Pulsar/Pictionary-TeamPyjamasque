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
import NonceGenerator from './middlewares/NonceGenerator';

dotenv.config();

export const app: express.Express = express();
const PORT = parseInt(process.env.PORT) || 5050;

app.use(NonceGenerator);

app.use(helmet(process.env.SOCKET_ADDRESS));

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

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(AuthChecker);

// routing
app.use(router);

app.use(pageNotFound);

let server;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/odraw',
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Mongoose connected');

    // lancer l'appli
    server = app.listen(PORT,
      () => {
        console.log(`App running on port ${PORT}`);
        const socketServer = new Server(server);
        socketServer.start();
        app.set('socketio',
          socketServer);
      });
  });

export default app;
