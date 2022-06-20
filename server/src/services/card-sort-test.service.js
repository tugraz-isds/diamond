const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');

const CardSortTest = db.CardSortTest;
const userService = require('../services/account.service');

module.exports = {
    saveCardSortResults
};

async function saveCardSortResults(resultParam) {
    const result = new CardSortTest(resultParam);
    // save user
    await result.save();
}
