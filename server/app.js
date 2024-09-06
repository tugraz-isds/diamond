require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
const accountController = require('./src/controllers/account.controller');
const userService = require('./src/services/account.service.js');

const app = express();

// #############################################################################
// Logs all request paths and method
app.use(function (req, res, next) {
  res.set('x-timestamp', Date.now());
  res.set('x-powered-by', 'cyclic.sh');
  console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`);
  next();
});

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
};
const publicDir = process.env.PUBLIC_DIR || '../client/dist/client';
app.use(express.static(publicDir, options));

app.use(cors());

const maxPayloadSize = process.env.MAX_REQUEST_PAYLOAD_SIZE || '6mb';
app.use(bodyParser.urlencoded({ extended: false, limit: maxPayloadSize }));
app.use(bodyParser.json({ limit: maxPayloadSize }));

app.use(jwt());

app.use('/users', accountController);

const adminEmail = process.env.ADMIN_USERNAME || 'admin';
const adminPwd = process.env.ADMIN_PWD || 'admin189m';

userService.create({ email: adminEmail, password: adminPwd })
  .then(() => console.log('Check admin account - ok'))
  .catch(err => {});

app.use(errorHandler);

module.exports = app;
