const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');
const Account = db.Account;
const TreeTestStudy = db.TreeTestStudy;
const TreeTestTest = db.TreeTestTest;
const CardSortTest = db.CardSortTest;
const CardSortStudy = db.CardSortStudy;

module.exports = {
    // Tree Test
    getTreeTestsById,
    saveTreeTests,
    editTreeTest,
    saveTreeTestFeedback,
    
    addTreeStudy,
    getTreeStudy,
    editTreeStudy,
    deleteTreeStudy,
    getAllTreeStudies,

    deleteIndividualTreeTest,
    treeStudyPassword,
    treeStudypasswordRequired,

    // Card Sort
    getCardSortResultsById,
    editCardSortResult,
    saveCardSortResults,
    saveCardSortMindset,
    saveCardSortFeedback,

    addCardSortTest,
    getCardSortTest,
    editCardSortTest,
    deleteCardSortTest,
    getAllCardSortTests,

    deleteIndividualCardSortResult,
    cardSortTestPassword,
    cardSortPasswordRequired,

    // User
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};


//#######################################
//########### User Functions ############
//#######################################

async function authenticate({ email, password }) {
    const user = await Account.findOne({ email });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await Account.find().select('-hash');
}

async function getById(id) {
    return await Account.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    if (await Account.findOne({ email: userParam.email })) {
        throw 'email "' + userParam.email + '" is already taken';
    }

    const user = new Account(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }
    // save user
    await user.save();
}

async function update(userParam) {
    const user = await Account.findById(userParam.userid);

    // validate
    if (!user) throw 'User not found';
    if (user.email !== userParam.email && await Account.findOne({ email: userParam.email })) {
        throw 'email "' + userParam.email + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }


    Object.assign(user, userParam);
    await user.save();
}

async function _delete(id) {
    await Account.findByIdAndRemove(id);
}


//#######################################
//######### Tree Test Functions #########
//#######################################


async function getTreeTestsById(id) {
    const treeTest = await TreeTestTest.find({ "id" : id });
    const treeStudy = await TreeTestStudy.find({ "id" : id });
    const object = {
        result: treeTest,
        test: treeStudy,
    }
    return object;
}
async function editTreeTest(updatedTreeTest){
    const treeTest = await TreeTestTest.findOne({ "_id": updatedTreeTest._id });
    if(updatedTreeTest.excluded !== undefined){
        treeTest["excluded"] = updatedTreeTest["excluded"];
    }

    await treeTest.save();
    return treeTest;
}
async function saveTreeTestFeedback(testParam) {
    const treeTestTest = await TreeTestTest.findOne({ username: testParam.username })

    treeTestTest.feedback = testParam.feedback;

    await treeTestTest.save();

    return treeTestTest;
}


async function saveTreeTests(resultParam) {
    const treeTests = new TreeTestTest(resultParam);
    // save user
    await treeTests.save();
}


async function addTreeStudy(testParam) {
    const treeStudy = new TreeTestStudy(testParam);
    // save user
    await treeStudy.save();
}

async function getAllTreeStudies(data) {

    const treeStudy = await TreeTestStudy.find({ "user" : data.user })
    return treeStudy;
}

async function treeStudypasswordRequired(studyId) {

    const treeStudy = await TreeTestStudy.find({ "id" : studyId });

    if (!treeStudy[0].launched) {
        return 'redirect';
    }

    if (treeStudy[0].password && treeStudy[0].password.length) {
       return true;
    } else {
       return false;
    }
}

async function treeStudyPassword(body) {

    const treeStudy = await TreeTestStudy.find({ "id" : body.id });
    if (treeStudy && treeStudy[0].password === body.password) {
        return treeStudy[0];
    }
    return false;
}

async function getTreeStudy(id) {

    const study = await TreeTestStudy.find({ "id" : id });
    return study;
}

async function deleteTreeStudy(testId) {
    const treeStudy = await TreeTestStudy.find({ "_id" : testId });
    await treeStudy[0].delete();
    return 1;
}

async function deleteIndividualTreeTest(resultId) {
    const treeTest = await TreeTestTest.find({ "_id" : resultId });
    await treeTest[0].delete();
    return 1;
}

async function editTreeStudy(updatedTest) {

    const treeStudy = await TreeTestStudy.find({ "id" : updatedTest.id });

    //Object.assign(test, updatedTest);
    if (updatedTest.name) {
        treeStudy[0].name = updatedTest.name;
    }
    if (updatedTest.password) {
        if (updatedTest.password !== "empty") {
            treeStudy[0].password = updatedTest.password;
        } else {
            treeStudy[0].password = "";
        }
    }
    if (updatedTest.tree) {
        treeStudy[0].tree = updatedTest.tree;
    }
    if (updatedTest.tasks) {
        treeStudy[0].tasks = updatedTest.tasks;
    }
    if (updatedTest.welcomeMessage) {
        treeStudy[0].welcomeMessage = updatedTest.welcomeMessage;
    }
    if (updatedTest.instructions) {
        treeStudy[0].instructions = updatedTest.instructions;
    }
    if (updatedTest.thankYouScreen) {
        treeStudy[0].thankYouScreen = updatedTest.thankYouScreen;
    }
    if (updatedTest.leafNodes !== undefined) {
        treeStudy[0].leafNodes = updatedTest.leafNodes;
    }
    if (updatedTest.orderNumbers !== undefined) {
        treeStudy[0].orderNumbers = updatedTest.orderNumbers;
    }
    if (updatedTest.launched !== undefined) {
        treeStudy[0].launched = updatedTest.launched;
    }
    if(updatedTest.lastLaunched){
        treeStudy[0].lastLaunched = updatedTest.lastLaunched
    }
    if(updatedTest.lastEnded){
        treeStudy[0].lastEnded = updatedTest.lastEnded
    }
    if(updatedTest.isLaunchable !== undefined){
        treeStudy[0].isLaunchable = updatedTest.isLaunchable
    }
    await treeStudy[0].save();

    return treeStudy[0];

}


//#######################################
//######### Card Sort Functions #########
//#######################################

async function getCardSortResultsById(id) {
    const result = await CardSortTest.find({ "id" : id });
    const card_sort_test = await CardSortStudy.find({ "id" : id });
    const object = {
        result: result,
        card_sort_test: card_sort_test,
    }
    return object;
}

async function saveCardSortMindset(resultParam) {
    const result = await CardSortTest.findOne({ username: resultParam.username })

    result.mindset = resultParam.mindset;

    await result.save();

    return result;
}

async function saveCardSortFeedback(resultParam) {
    const result = await CardSortTest.findOne({ username: resultParam.username })

    result.feedback = resultParam.feedback;

    await result.save();

    return result;
}
async function editCardSortResult(updatedResult){
    const result = await CardSortTest.findOne({ "_id": updatedResult._id });
    if(updatedResult.excluded !== undefined){
        result["excluded"] = updatedResult["excluded"];
    }

    await result.save();
    return result;
}
async function saveCardSortResults(resultParam) {
    const result = new CardSortTest(resultParam);
    // save user
    await result.save();
}

async function cardSortPasswordRequired(studyId) {

    const test = await CardSortStudy.find({ "id" : studyId });
    if (!test[0].launched) {
        return 'redirect';
    }
    if (test[0].password && test[0].password.length) {
        return true;
    } else {
        return false;
    }
}

async function addCardSortTest(testParam) {
    const test = new CardSortStudy(testParam);
    // save user
    await test.save();
}

async function getAllCardSortTests(data) {

    const tests = await CardSortStudy.find({ "user" : data.user })
    return tests;
}

async function cardSortTestPassword(body) {

    const test = await CardSortStudy.find({ "id" : body.id });
    if (test && test[0].password === body.password) {
        return test[0];
    }
    return false;
}

async function getCardSortTest(id) {

    const test = await CardSortStudy.find({ "id" : id });
    return test;
}

async function deleteCardSortTest(testId) {
    const test = await CardSortStudy.find({ "_id" : testId });
    await test[0].delete();
    return 1;
}

async function deleteIndividualCardSortResult(resultId) {
    const result = await CardSortTest.find({ "_id" : resultId });
    await result[0].delete();
    return 1;
}

async function editCardSortTest(updatedTest) {

    const test = await CardSortStudy.find({ "id" : updatedTest.id });

    //Object.assign(test, updatedTest);
    if (updatedTest.name) {
        test[0].name = updatedTest.name;
    }
    if (updatedTest.password) {
        if (updatedTest.password !== "empty") {
            test[0].password = updatedTest.password;
        } else {
            test[0].password = "";
        }
    }
    if (updatedTest.cards) {
        test[0].cards = updatedTest.cards;
    }
    if (updatedTest.welcomeMessage) {
        test[0].welcomeMessage = updatedTest.welcomeMessage;
    }
    if (updatedTest.instructions) {
        test[0].instructions = updatedTest.instructions;
    }
    if (updatedTest.explanation) {
        test[0].explanation = updatedTest.explanation;
    }
    if (updatedTest.thankYouScreen) {
        test[0].thankYouScreen = updatedTest.thankYouScreen;
    }
    if (updatedTest.subCategories !== undefined) {
        test[0].subCategories = updatedTest.subCategories;
    }
    if (updatedTest.launched !== undefined) {
        test[0].launched = updatedTest.launched;
    }
    if(updatedTest.lastLaunched){
        test[0].lastLaunched = updatedTest.lastLaunched
    }
    if(updatedTest.lastEnded){
        test[0].lastEnded = updatedTest.lastEnded
    }
    
    await test[0].save();

    return test[0];

}
