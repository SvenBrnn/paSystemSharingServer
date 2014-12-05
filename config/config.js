/**
 * Module dependencies.
 */
var path = require('path');
var extend = require('util')._extend;
var local = require('./env/local');
var heroku = require('./env/heroku');
var defaults = {
    root: path.normalize(__dirname + '/..')
};
/**
 * Expose
 */
module.exports = {
    local: extend(local, defaults),
    heroku: extend(heroku, defaults)
}[process.env.NODE_ENV || 'local'];