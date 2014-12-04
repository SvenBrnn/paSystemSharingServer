
/*!
 * Module dependencies.
 */
// Note: We can require users, articles and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)
var systems = require('systems');

var auth = require('./middlewares/authorization');
/**
 * Route middlewares
 */
//None Yet

/**
 * Expose routes
 */
module.exports = function (app, passport) {

    app.get('/search', systems.searchSystems);
    app.post('/save', auth.checkNoTokenEnabled, systems.saveSystem);
    app.post('/save/:token', auth.checkToken, systems.saveSystem);


    /**
     * Error handling
     */
    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
            || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }
        console.error(err.stack);
        // error page
        res.status(500).send({status: '500',  data: { error: err.stack }});
    });
    // assume 404 since no middleware responded
    app.use(function (req, res, next) {
        res.status(404).send({status: '404', data: {
            url: req.originalUrl,
            error: 'Not found'
        }});
    });
}