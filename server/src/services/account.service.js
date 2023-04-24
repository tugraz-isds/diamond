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
    saveMultipleTreeTests,
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
    getCardSortTestsById,
    editCardSortTest,
    saveCardSortTests,
    saveMultipleCardSortTests,
    saveCardSortMindset,
    saveCardSortFeedback,

    addCardSortStudy,
    getCardSortStudy,
    editCardSortStudy,
    deleteCardSortStudy,
    getAllCardSortStudies,

    deleteIndividualCardSortTest,
    cardSortStudyPassword,
    cardSortStudyPasswordRequired,

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
        const secret = process.env.JWT_SECRET || 'Diamond Default Secret - USE JWT_SECRET env in production!'; // FIXME: use a public key as secret? key rotation?
        const token = jwt.sign({ sub: user.id }, secret ); // FIXME: set expiry date { expiresIn: '60s' }
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
    const user = await Account.findById(userParam.id);

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

async function saveMultipleTreeTests(resultParams) {
  await Promise.all(resultParams.map(item => saveTreeTests(item)));
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

async function getCardSortTestsById(id) {
    const cardSortTest = await CardSortTest.find({ "id" : id });
    const cardSortStudy = await CardSortStudy.find({ "id" : id });
    const object = {
        result: cardSortTest,
        card_sort_test: cardSortStudy,
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
async function editCardSortTest(updatedCardSortTest){
    const cardSortTest = await CardSortTest.findOne({ "_id": updatedCardSortTest._id });
    if(updatedCardSortTest.excluded !== undefined){
        cardSortTest["excluded"] = updatedCardSortTest["excluded"];
    }

    await cardSortTest.save();
    return cardSortTest;
}
async function saveCardSortTests(resultParam) {
    const result = new CardSortTest(resultParam);
    // save user
    await result.save();
}

async function saveMultipleCardSortTests(testParams) {
  await Promise.all(testParams.map(item => saveCardSortTests(item)));
}

async function cardSortStudyPasswordRequired(studyId) {
    const cardSortStudy = await CardSortStudy.find({ "id" : studyId });
    if (!cardSortStudy[0].launched) {
        return 'redirect';
    }
    if (cardSortStudy[0].password && cardSortStudy[0].password.length) {
        return true;
    } else {
        return false;
    }
}

async function addCardSortStudy(testParam) {
    const cardSortStudy = new CardSortStudy(testParam);
    // save user
    await cardSortStudy.save();
}

async function getAllCardSortStudies(data) {

    const cardSortStudies = await CardSortStudy.find({ "user" : data.user })
    return cardSortStudies;
}

async function cardSortStudyPassword(body) {
    const cardSortStudy = await CardSortStudy.find({ "id" : body.id });
    if (cardSortStudy && cardSortStudy[0].password === body.password) {
        return cardSortStudy[0];
    }
    return false;
}

async function getCardSortStudy(id) {
    const cardSortStudy = await CardSortStudy.find({ "id" : id });
    return cardSortStudy;
}

async function deleteCardSortStudy(studyId) {
    const cardSortStudy = await CardSortStudy.find({ "_id" : studyId });
    await cardSortStudy[0].delete();
    return 1;
}

async function deleteIndividualCardSortTest(resultId) {
    const cardSortTest = await CardSortTest.find({ "_id" : resultId });
    await cardSortTest[0].delete();
    return 1;
}

async function editCardSortStudy(updatedStudy) {

    const cardSortStudy = await CardSortStudy.find({ "id" : updatedStudy.id });

    if (updatedStudy.name) {
        cardSortStudy[0].name = updatedStudy.name;
    }
    if (updatedStudy.password) {
        if (updatedStudy.password !== "empty") {
            cardSortStudy[0].password = updatedStudy.password;
        } else {
            cardSortStudy[0].password = "";
        }
    }
    if (updatedStudy.cards) {
        cardSortStudy[0].cards = updatedStudy.cards;
    }
    if (updatedStudy.welcomeMessage) {
        cardSortStudy[0].welcomeMessage = updatedStudy.welcomeMessage;
    }
    if (updatedStudy.instructions) {
        cardSortStudy[0].instructions = updatedStudy.instructions;
    }
    if (updatedStudy.explanation) {
        cardSortStudy[0].explanation = updatedStudy.explanation;
    }
    if (updatedStudy.thankYouScreen) {
        cardSortStudy[0].thankYouScreen = updatedStudy.thankYouScreen;
    }
    if (updatedStudy.subCategories !== undefined) {
        cardSortStudy[0].subCategories = updatedStudy.subCategories;
    }
    if (updatedStudy.launched !== undefined) {
        cardSortStudy[0].launched = updatedStudy.launched;
    }
    if(updatedStudy.lastLaunched){
        cardSortStudy[0].lastLaunched = updatedStudy.lastLaunched
    }
    if(updatedStudy.lastEnded){
        cardSortStudy[0].lastEnded = updatedStudy.lastEnded
    }

    await cardSortStudy[0].save();

    return cardSortStudy[0];

}
