// importer les variables d'environnement
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import router from "./router";

const app: express.Express = express();
const PORT = process.env.PORT || 5050;

// setup view engine
app.set('views', 'views');
app.set('view engine', 'pug');

//routing
app.use(router);

// lancer l'appli
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
