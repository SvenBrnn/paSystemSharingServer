/**
 * Module dependencies.
 */
var express = require('express');
var session = require('express-session');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var multer = require('multer');
var mongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var winston = require('winston');
var helpers = require('view-helpers');
var config = require('config');
var pkg = require('../package.json');
var env = process.env.NODE_ENV || 'local';

/**
 * Expose
 */
module.exports = function (app, passport) {
    // Compression middleware (should be placed before express.static)
    app.use(compression({
        threshold: 512
    }));
    // Static files middleware
    app.use(express.static(config.root + '/public'));
    // Use winston on heroku
    var log;
    if (env !== 'local') {
        log = {
            stream: {
                write: function (message, encoding) {
                    winston.info(message);
                }
            }
        };
    } else {
        log = 'dev';
    }

    // bodyParser should be above methodOverride
    app.use(bodyParser.json({limit: '1mb'}));
    app.use(bodyParser.urlencoded({ extended: true, limit: '1mb'  }));
    app.use(multer());
    app.use(methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));

    // CookieParser should be above session
    app.use(cookieParser());
    app.use(cookieSession({ secret: 'secret' }));
    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: pkg.name,
        store: new mongoStore({
            url: config.db,
            collection: 'sessions'
        })
    }));
    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());
    // connect flash for flash messages - should be declared after sessions
    app.use(flash());
    // should be declared after session and flash
    app.use(helpers(pkg.name));

    //Set CORS headers
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        next();
    });
};