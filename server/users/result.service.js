const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const User = db.User;
const Test = db.Test;
const Result = db.Result;
const userService = require('./user.service');

module.exports = {
    saveResults
};

async function saveResults(resultParam) {
    const result = new Result(resultParam);
    // save user
    await result.save();
}