const express = require('express');
const router = express.Router();
const testsService = require('./test.service');

// routes
router.post('/tests/getbyuserid', getTestsByUserId);

module.exports = router;

function getTestsByUserId(req, res, next) {
    testsService.getAllTestsByUser(req.body.user)
        .then(tests => tests ? res.json(tests) : res.sendStatus(404))
        .catch(err => next(err));
}