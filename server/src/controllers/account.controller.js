const express = require('express');
const router = express.Router();
const userService = require('../services/account.service');

// routes

// User
router.post('/authenticate', authenticate);
router.post('/adminregister', adminregister);
router.post('/register', register);
router.post('/', getAll);
router.get('/current', getCurrent);
router.get('/get/:id', getById);
router.put('/', update);
router.delete('/:id', _delete);

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
router.post('/tree-tests/add-multiple', saveMultipleTreeTests);
router.post('/tree-tests/feedback', saveTreeTestFeedback);
router.post('/tree-tests/get/:id', getTreeTestsById);
router.post('/tree-tests/delete', deleteIndividualTreeTest);
router.post('/tree-tests/edit', editTreeTest);

// Card Sort
router.post('/card-sort-study/add', addCardSortStudy);
router.post('/card-sort-study/get', getCardSortStudy);
router.post('/card-sort-study/password', cardSortStudyPassword);
router.post('/card-sort-study/passwordrequired', cardSortStudyPasswordRequired);
router.post('/card-sort-study/edit', editCardSortStudy);
router.post('/card-sort-study/delete', deleteCardSortStudy);
router.post('/card-sort-study/getbyuserid', getAllCardSortStudies);

router.post('/card-sort-tests/add', saveCardSortTests);
router.post('/card-sort-tests/add-multiple', saveMultipleCardSortTests);
router.post('/card-sort-tests/mindset', saveCardSortMindset);
router.post('/card-sort-tests/feedback', saveCardSortFeedback);
router.post('/card-sort-tests/get/:id', getCardSortTestsById);
router.post('/card-sort-tests/delete', deleteIndividualCardSortTest);
router.post('/card-sort-tests/edit', editCardSortTest);

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
    userService.delete(req.params.id)
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

function saveMultipleTreeTests(req, res, next) {
  userService.saveMultipleTreeTests(req.body)
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


function getCardSortTestsById(req, res, next) {
    userService.getCardSortTestsById(req.params.id)
        .then(results => results ? res.json(results) : res.sendStatus(404))
        .catch(err => next(err));
}

function saveCardSortTests(req, res, next) {
    userService.saveCardSortTests(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function saveMultipleCardSortTests(req, res, next) {
  userService.saveMultipleCardSortTests(req.body)
        .then(()=> res.json({}))
        .catch(err => next(err));
}

function editCardSortTest(req, res, next){
    userService.editCardSortTest(req.body)
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


function cardSortStudyPasswordRequired(req, res, next) {
    userService.cardSortStudyPasswordRequired(req.body.id)
        .then(bool => res.json(bool))
        .catch(err => next(err));
}

function addCardSortStudy(req, res, next) {
    userService.addCardSortStudy(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getCardSortStudy(req, res, next) {
    userService.getCardSortStudy(req.body.id)
        .then((test) => res.json(test[0]))
        .catch(err => next(err));
}

function getAllCardSortStudies(req, res, next) {
    userService.getAllCardSortStudies(req.body)
        .then((cardSortStudies) => res.json(cardSortStudies))
        .catch(err => next(err));
}

function cardSortStudyPassword(req, res, next) {
    userService.cardSortStudyPassword(req.body)
        .then((test) => res.json(test))
        .catch(err => next(err));
}

function editCardSortStudy(req, res, next) {
    userService.editCardSortStudy(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function deleteIndividualCardSortTest(req, res, next) {
    userService.deleteIndividualCardSortTest(req.body.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function deleteCardSortStudy(req, res, next) {
    userService.deleteCardSortStudy(req.body.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
