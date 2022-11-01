const express = require('express');
const router = express.Router();
const userService = require('../services/account.service');
const resultService = require('../services/tree-test-test.service');

// routes

// User
router.post('/authenticate', authenticate);
router.post('/adminregister', adminregister);
router.post('/register', register);
router.post('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.post('/:id', _delete);

// Tree Study
router.post('/tree-study/add', addTreeStudy);
router.post('/tree-study/get', getTreeStudy);
router.post('/tree-study/password', treeStudyPassword);
router.post('/tree-study/passwordrequired', treeStudypasswordRequired);
router.post('/tree-study/edit', editTreeStudy);
router.post('/tree-study/delete', deleteTreeStudy);
router.post('/tree-study/getbyuserid', getAllTreeStudies);
// Tree Tests
router.post('/tree-tests/add', saveTreeTests);
router.post('/tree-tests/feedback', saveTreeTestFeedback);
router.post('/tree-tests/:id', getTreeTestsById);
router.post('/tree-test/delete', deleteIndividualTreeTest);
router.post('/tree-test/edit', editTreeTest);

// Card Sort
router.post('/card-sort-test/add', addCardSortTest);
router.post('/card-sort-test/get', getCardSortTest);
router.post('/card-sort-test/password', cardSortTestPassword);
router.post('/card-sort-test/passwordrequired', cardSortPasswordRequired);
router.post('/card-sort-test/edit', editCardSortTest);
router.post('/card-sort-test/delete', deleteCardSortTest);
router.post('/card-sort-test/getbyuserid', getAllCardSortTests);

router.post('/card-sort-results/add', saveCardSortResults);
router.post('/card-sort-results/mindset', saveCardSortMindset);
router.post('/card-sort-results/feedback', saveCardSortFeedback);
router.post('/card-sort-results/:id', getCardSortResultsById);
router.post('/card-sort-result/delete', deleteIndividualCardSortResult);
router.post('/card-sort-result/edit', editCardSortResult);

module.exports = router;

//#######################################
//########### User Functions ############
//#######################################

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Email or password is incorrect' }))
        .catch(err => next(err));
}

function adminregister(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.body.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

//#######################################
//##########Tree Test Functions##########
//#######################################

function getTreeTestsById(req, res, next) {
    userService.getTreeTestsById(req.params.id)
        .then(results => results ? res.json(results) : res.sendStatus(404))
        .catch(err => next(err));
}

function saveTreeTests(req, res, next) {
    userService.saveTreeTests(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function saveTreeTestFeedback(req, res, next) {
    userService.saveTreeTestFeedback(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function addTreeStudy(req, res, next) {
    userService.addTreeStudy(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getTreeStudy(req, res, next) {
    userService.getTreeStudy(req.body.id)
        .then((test) => res.json(test[0]))
        .catch(err => next(err));
}

function treeStudypasswordRequired(req, res, next) {
    userService.treeStudypasswordRequired(req.body.id)
        .then(bool => res.json(bool))
        .catch(err => next(err));
}

function treeStudyPassword(req, res, next) {
    userService.treeStudyPassword(req.body)
        .then((test) => res.json(test))
        .catch(err => next(err));
}

function editTreeStudy(req, res, next) {
    userService.editTreeStudy(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function deleteTreeStudy(req, res, next) {
    userService.deleteTreeStudy(req.body.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function deleteIndividualTreeTest(req, res, next) {
    userService.deleteIndividualTreeTest(req.body.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function editTreeTest(req, res, next){
    userService.editTreeTest(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAllTreeStudies(req, res, next) {
    userService.getAllTreeStudies(req.body)
        .then((tests) => res.json(tests))
        .catch(err => next(err));
}


//#######################################
//######### Card Sort Functions #########
//#######################################


function getCardSortResultsById(req, res, next) {
    userService.getCardSortResultsById(req.params.id)
        .then(results => results ? res.json(results) : res.sendStatus(404))
        .catch(err => next(err));
}

function saveCardSortResults(req, res, next) {
    userService.saveCardSortResults(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
function editCardSortResult(req, res, next){
    userService.editCardSortResult(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
function saveCardSortMindset(req, res, next){
    userService.saveCardSortMindset(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function saveCardSortFeedback(req, res, next) {
    userService.saveCardSortFeedback(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}


function cardSortPasswordRequired(req, res, next) {
    userService.cardSortPasswordRequired(req.body.id)
        .then(bool => res.json(bool))
        .catch(err => next(err));
}

function addCardSortTest(req, res, next) {
    userService.addCardSortTest(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getCardSortTest(req, res, next) {
    userService.getCardSortTest(req.body.id)
        .then((test) => res.json(test[0]))
        .catch(err => next(err));
}

function getAllCardSortTests(req, res, next) {
    userService.getAllCardSortTests(req.body)
        .then((tests) => res.json(tests))
        .catch(err => next(err));
}

function cardSortTestPassword(req, res, next) {
    userService.cardSortTestPassword(req.body)
        .then((test) => res.json(test))
        .catch(err => next(err));
}

function editCardSortTest(req, res, next) {
    userService.editCardSortTest(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function deleteIndividualCardSortResult(req, res, next) {
    userService.deleteIndividualCardSortResult(req.body.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function deleteCardSortTest(req, res, next) {
    userService.deleteCardSortTest(req.body.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
