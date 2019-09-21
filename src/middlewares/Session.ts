import session from 'express-session';

export default session({
  secret: process.env.SESSION_SECRET || 'dummy',
  resave: true,
  saveUninitialized: false,
  name: process.env.SESSION_NAME || 'dummy',
});
