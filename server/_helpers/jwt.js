var { expressjwt } = require("express-jwt");
const userService = require('../src/services/account.service');


module.exports = jwt;

function jwt() {
    const secret = process.env.JWT_SECRET || 'Diamond Default Secret - USE JWT_SECRET env in production!';
    return expressjwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register',
            /^\/users\/results\/.*/,
            /^\/users\/card-sort-results\/.*/,
            '/users/tree-study/passwordrequired',
            '/users/card-sort-study/passwordrequired',
            '/users/tree-study/password',
            '/users/card-sort-study/password',
            '/users/tree-tests/add',
            '/users/card-sort-tests/add'

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
