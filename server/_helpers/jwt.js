const expressJwt = require('express-jwt');
const config = require('../config.json');
const userService = require('../users/user.service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register',
            /^\/users\/results\/.*/,
            /^\/users\/card-sort-results\/.*/,
            '/users/test/passwordrequired',
            '/users/card-sort-test/passwordrequired',
            '/users/test/password',
            '/users/card-sort-test/password',
            '/users/results/add',
            '/users/card-sort-results/add'

        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};
