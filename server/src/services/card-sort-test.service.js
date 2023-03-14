const db = require('../../_helpers/db');

const CardSortTest = db.CardSortTest;

module.exports = {
    saveCardSortResults
};

async function saveCardSortResults(resultParam) {
    const result = new CardSortTest(resultParam);
    // save user
    await result.save();
}
