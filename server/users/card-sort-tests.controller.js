const express = require('express');
const router = express.Router();
const testsService = require('./card-sort-test.service');

// routes
router.post('/card-sort-tests/getbyuserid', getCardSortTestsByUserId);

module.exports = router;

function getCardSortTestsByUserId(req, res, next) {
    testsService.getAllCardSortTestsByUser(req.body.user)
        .then(tests => tests ? res.json(tests) : res.sendStatus(404))
        .catch(err => next(err));
}
