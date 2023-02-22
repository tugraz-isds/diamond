// database_connection_url can point to a local MongoDB, or to Heroku based MongoDB
// Example for local MongoDB URL: "mongodb://localhost:27017/node-mongo-registration-login-api"
// Example for Heroku based MongoDB: "mongodb+srv://root:root@cluster0-wqaum.mongodb.net/test?retryWrites=true&w=majority"

const mongoose = require('mongoose');
const UserPaths = require('../user-paths.js');

const database_connection_url = process.env.DB_CONNECTION_URL || UserPaths.db_connection_url;

mongoose.connect(database_connection_url, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;

module.exports = {
    Account: require('../src/models/account.model'),
    TreeTestStudy: require('../src/models/tree-test-study.model'),
    TreeTestTest: require('../src/models/tree-test-test.model'),
    CardSortStudy: require('../src/models/card-sort-study.model'),
    CardSortTest: require('../src/models/card-sort-test.model'),
    database_connection_url
};
