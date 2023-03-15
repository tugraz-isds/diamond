/*var express = require('express');
var app = express();
app.use(express.static('myApp')); // myApp will be the same folder name.
app.get('/', function (req, res,next) {
  console.log("HERE");
 res.redirect('/'); 
});
app.listen(8080, 'localhost');
console.log('MyProject Server is Listening on port 8080');*/
/*
 * Copyright (c) 2018 Robotic Eyes GmbH
 *
 * This is the main file for the NG back-end server.
 */
const express = require('express')
const path = require('path')
const http = require('http')

const app = express()

// Point static path to dist
app.use(express.static(path.join(__dirname, '../dist')))

// Catch all other routes and return the index file
/*app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/tre-testing/index.html'))
})*/

app.get('/', function (req, res,next) {
  console.log("HERE5");
 res.redirect('/'); 
});

app.set('port', 48792)

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
if (!module.parent) { // start listening when you are not running under test
  server.listen(app.get('port'), () => {
    console.log('HERE')
  })
}

module.exports = { server } // for testing
