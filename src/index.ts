// importer les variables d'environnement
import dotenv from 'dotenv';
import express from 'express';
import router from "./router";
import mongoose from 'mongoose';
import morgan from 'morgan';
import "reflect-metadata";
import flash from 'express-flash-notification';
import session from 'express-session';
import AuthChecker from './middlewares/AuthChecker';
import cookieParser from 'cookie-parser';

const app: express.Express = express();
const PORT = process.env.PORT || 5050;

dotenv.config();

app.use(cookieParser('dummy' || process.env.COOKIE_SECRET));

app.use(session({
  secret: process.env.SESSION_SECRET || "dummy", 
  resave: true,
  saveUninitialized: false
}));

app.use(flash(app, {
  sessionName: 'flash',
  utilityName: 'flash',
  localsName: 'flash',
  viewName: 'includes/flash',
  beforeSingleRender: function(item, callback){ callback(null, item) },
  afterAllRender: function(htmlFragments, callback){ callback(null, htmlFragments.join('\n')) }
}));

// setup view engine
app.set('views', 'views');
app.set('view engine', 'pug');

app.use(express.static('public'));

// Middlewares moved morgan into if for clear tests
if (process.env.NODE_ENV !== 'prod') {
  app.use(morgan('dev'));
}

app.use(AuthChecker);

//routing
app.use(router);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/odraw", {useNewUrlParser: true}, (err) => {
  if (err){
    console.log(err);
    return;
  }

  console.log('Mongoose connected');

  // lancer l'appli
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });

})
