var config = require('config');

/*
 * Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
    if (req.isAuthenticated()) return next()
    if (req.method == 'GET') req.session.returnTo = req.originalUrl
    res.redirect('/login')
};

exports.checkNoTokenEnabled = function (req, res, next) {
    if(config.token.authType === 'none')
        return next();

    return req.send({'status': false, 'message': 'invalide token'});
}

exports.checkToken = function (req, res, next, token) {
    if(config.token.authType === 'none')
        return next();

    if(config.token.authType === 'default' && config.token.defaultToken === token)
        return next();

    //Todo: implement user authentication later

    return req.send({'status': false, 'message': 'invalide token'});
}