const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const User = db.User;
const Test = db.Test;
const Result = db.Result;
const CardSortResult = db.CardSortResult;
const CardSortTest = db.CardSortTest;

module.exports = {
    // Tree Test
    getResultsById,
    saveResults,
    saveFeedback,
    
    addTest,
    getTest,
    editTest,
    deleteTest,
    getAllTests,

    deleteIndividualResult,
    testPassword,
    passwordRequired,

    // Card Sort
    getCardSortResultsById,
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
    const user = await User.findOne({ email });
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
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    if (await User.findOne({ email: userParam.email })) {
        throw 'email "' + userParam.email + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }
    // save user
    await user.save();
}

async function update(userParam) {
    const user = await User.findById(userParam.userid);

    // validate
    if (!user) throw 'User not found';
    if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
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
    await User.findByIdAndRemove(id);
}


//#######################################
//######### Tree Test Functions #########
//#######################################


async function getResultsById(id) {
    const result = await Result.find({ "id" : id });
    const test = await Test.find({ "id" : id });
    const card_sort_test = await CardSortTest.find({ "id" : id });
    const object = {
        result: result,
        test: test,
    }
    return object;
}

async function saveFeedback(resultParam) {
    const result = await Result.findOne({ username: resultParam.username })

    result.feedback = resultParam.feedback;

    await result.save();

    return result;
}


async function saveResults(resultParam) {
    const result = new Result(resultParam);
    // save user
    await result.save();
}


async function addTest(testParam) {
    const test = new Test(testParam);
    // save user
    await test.save();
}

async function getAllTests(data) {

    const tests = await Test.find({ "user" : data.user })
    return tests;
}

async function passwordRequired(studyId) {

    const test = await Test.find({ "id" : studyId });

    if (!test[0].launched) {
        return 'redirect';
    }

    if (test[0].password && test[0].password.length) {
       return true;
    } else {
       return false;
    }
}

async function testPassword(body) {

    const test = await Test.find({ "id" : body.id });
    if (test && test[0].password === body.password) {
        return test[0];
    }
    return false;
}

async function getTest(id) {

    const test = await Test.find({ "id" : id });
    return test;
}

async function deleteTest(testId) {
    const test = await Test.find({ "_id" : testId });
    await test[0].delete();
    return 1;
}

async function deleteIndividualResult(resultId) {
    const result = await Result.find({ "_id" : resultId });
    await result[0].delete();
    return 1;
}

async function editTest(updatedTest) {

    const test = await Test.find({ "id" : updatedTest.id });

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
    if (updatedTest.tree) {
        test[0].tree = updatedTest.tree;
    }
    if (updatedTest.tasks) {
        test[0].tasks = updatedTest.tasks;
    }
    if (updatedTest.welcomeMessage) {
        test[0].welcomeMessage = updatedTest.welcomeMessage;
    }
    if (updatedTest.instructions) {
        test[0].instructions = updatedTest.instructions;
    }
    if (updatedTest.thankYouScreen) {
        test[0].thankYouScreen = updatedTest.thankYouScreen;
    }
    if (updatedTest.leafNodes !== undefined) {
        test[0].leafNodes = updatedTest.leafNodes;
    }
    if (updatedTest.orderNumbers !== undefined) {
        test[0].orderNumbers = updatedTest.orderNumbers;
    }
    if (updatedTest.launched !== undefined) {
        test[0].launched = updatedTest.launched;
    }

    await test[0].save();

    return test[0];

}


//#######################################
//######### Card Sort Functions #########
//#######################################

async function getCardSortResultsById(id) {
    const result = await CardSortResult.find({ "id" : id });
    const card_sort_test = await CardSortTest.find({ "id" : id });
    const object = {
        result: result,
        card_sort_test: card_sort_test,
    }
    return object;
}

async function saveCardSortMindset(resultParam) {
    const result = await CardSortResult.findOne({ username: resultParam.username })

    result.mindset = resultParam.mindset;

    await result.save();

    return result;
}

async function saveCardSortFeedback(resultParam) {
    const result = await CardSortResult.findOne({ username: resultParam.username })

    result.feedback = resultParam.feedback;

    await result.save();

    return result;
}

async function saveCardSortResults(resultParam) {
    const result = new CardSortResult(resultParam);
    // save user
    await result.save();
}

async function cardSortPasswordRequired(studyId) {

    const test = await CardSortTest.find({ "id" : studyId });
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
    const test = new CardSortTest(testParam);
    // save user
    await test.save();
}

async function getAllCardSortTests(data) {

    const tests = await CardSortTest.find({ "user" : data.user })
    return tests;
}

async function cardSortTestPassword(body) {

    const test = await CardSortTest.find({ "id" : body.id });
    if (test && test[0].password === body.password) {
        return test[0];
    }
    return false;
}

async function getCardSortTest(id) {

    const test = await CardSortTest.find({ "id" : id });
    return test;
}

async function deleteCardSortTest(testId) {
    const test = await CardSortTest.find({ "_id" : testId });
    await test[0].delete();
    return 1;
}

async function deleteIndividualCardSortResult(resultId) {
    const result = await CardSortResult.find({ "_id" : resultId });
    await result[0].delete();
    return 1;
}

async function editCardSortTest(updatedTest) {

    const test = await CardSortTest.find({ "id" : updatedTest.id });

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

    await test[0].save();

    return test[0];

}
