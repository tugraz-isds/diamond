require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./server/_helpers/jwt');
const errorHandler = require('./server/_helpers/error-handler');
const db = require('./server/_helpers/db');

const userService = require('./server/src/services/account.service');

var mongodb = require("mongodb");

/////

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

/////

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./server/src/controllers/account.controller'));
app.use('/users', require('./server/src/controllers/tree-test-study.controller'));
app.use('/users', require('./server/src/controllers/card-sort-study.controller'));
app.use('/users', require('./server/src/controllers/tree-test-test.controller'));
//app.use('/users', require('./server/src/card-sort-test.controller'));

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
