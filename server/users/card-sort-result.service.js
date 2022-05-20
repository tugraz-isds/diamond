const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const User = db.User;
const Test = db.Test;
const CardSortResult = db.CardSortResult;
const userService = require('./user.service');

module.exports = {
    saveCardSortResults
};

async function saveCardSortResults(resultParam) {
    const result = new CardSortResult(resultParam);
    // save user
    await result.save();
}
