/* Use this file to configure your server URL and your database connection URL.
You have the opportunity to choose the path for local or heroku deployment.
Just uncomment the 2 lines you prefer for the next build. */

const UserPaths = {

///// SERVER URL: /////

// Local
server_url: 'http://localhost:48792',

// Heroku
// server_url: 'https://iaweb-diamond.herokuapp.com',


///// DB CONNECTION URL: /////

// Local
db_connection_url: 'mongodb://localhost:27017/node-mongo-registration-login-api',

// Heroku
// db_connection_url: "mongodb+srv://admin:admin189m@iaweb-test-suite.kvxk0.mongodb.net/iaweb-test-suite?retryWrites=true&w=majority",

}

module.exports = UserPaths;
