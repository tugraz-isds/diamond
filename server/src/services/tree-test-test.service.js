const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');

const TreeTestTest = db.TreeTestTest;
const userService = require('./account.service');

module.exports = {
    saveResults
};

async function saveResults(resultParam) {
    const treeTest = new TreeTestTest(resultParam);
    // save user
    await treeTest.save();
}