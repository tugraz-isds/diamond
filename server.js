require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('./server/_helpers/jwt');
const errorHandler = require('./server/_helpers/error-handler');
const config = require('./server/config.json');
const expressJwt = require('express-jwt');
const db = require('./server/_helpers/db');

const userService = require('./server/users/user.service');

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
app.use('/users', require('./server/users/users.controller'));
app.use('/users', require('./server/users/tests.controller'));
app.use('/users', require('./server/users/card-sort-tests.controller'));
app.use('/users', require('./server/users/result.controller'));
//app.use('/users', require('./server/users/card-sort-result.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = 48792;


  var dbb;

  // Connect to the database before starting the application server.
  mongodb.MongoClient.connect(db.database_connection_url || db.database_connection_url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  
    // Save database object from the callback for reuse.
    dbb = client.db();
    console.log("Database connection ready");
  
    // Initialize the app.
    var server = app.listen(process.env.PORT || 48792, function () {
      var port = server.address().port;
      console.log("App now running on port", port);

      // add admin user
      userService.create({ email: 'admin', password: 'admin189m' })
        .then(() => res.json({}))
        .catch(err => {});
      // { email: 'newuser', password: 'newuser' }

    });
  });