require('rootpath')();
require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./_helpers/jwt');
const errorHandler = require('./_helpers/error-handler');
const db = require('./_helpers/db');

const userService = require('./src/services/account.service');

var mongodb = require("mongodb");

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
// src: https://github.com/cyclic-software/express-hello-world/blob/main/app.js
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}
const publicDir = process.env.PUBLIC_DIR || '../client/dist/client';
app.use(express.static(publicDir, options))

app.use(cors());

const maxPayloadSize = process.env.MAX_REQUEST_PAYLOAD_SIZE || '6mb';
app.use(bodyParser.urlencoded({ extended: false, limit: maxPayloadSize }));
app.use(bodyParser.json({ limit: maxPayloadSize }));


// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./src/controllers/account.controller'));
// app.use('/users', require('./src/controllers/tree-test-study.controller'));
// app.use('/users', require('./src/controllers/card-sort-study.controller'));
// app.use('/users', require('./src/controllers/tree-test-test.controller'));
//app.use('/users', require('./src/card-sort-test.controller'));

// global error handler
app.use(errorHandler);

// start server
const appPort = process.env.PORT || 8000;
const adminEmail = process.env.ADMIN_EMAIL || 'admin';
const adminPwd = process.env.ADMIN_PWD || 'admin189m';

var dbb;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(db.database_connection_url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  dbb = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(appPort, function () {
    var port = server.address().port;
    console.log("App now running on port", port);

    // add admin user
    userService.create({ email: adminEmail, password: adminPwd })
      .then(() => res.json({}))
      .catch(err => {});

  });
});
