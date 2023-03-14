const db = require('../../_helpers/db');

const TreeTestTest = db.TreeTestTest;

module.exports = {
    saveResults
};

async function saveResults(resultParam) {
    const treeTest = new TreeTestTest(resultParam);
    // save user
    await treeTest.save();
}
