/*!
 * Module dependencies.
 */
var fs = require('fs');
var path = require('path');
var env = {};
var envFile = __dirname + '/env.json';
// Read env.json file, if it exists, load the id's and secrets from that
// Note that this is only in the local env
// it is not safe to store id's in files
if (fs.existsSync(envFile)) {
    env = fs.readFileSync(envFile, 'utf-8');
    env = JSON.parse(env);
    Object.keys(env).forEach(function (key) {
        process.env[key] = env[key];
    });
}
/**
 * Expose
 */
module.exports = {
    db: 'mongodb://localhost/paSystemShareDev',
    facebook: {
        clientID: process.env.FACEBOOK_CLIENTID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
        clientID: process.env.TWITTER_CLIENTID,
        clientSecret: process.env.TWITTER_SECRET,
        callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    github: {
        clientID: process.env.GITHUB_CLIENTID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    linkedin: {
        clientID: process.env.LINKEDIN_CLIENTID,
        clientSecret: process.env.LINKEDIN_SECRET,
        callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    },
    google: {
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    notifier: {
        service: 'postmark',
        APN: false,
        email: true, // true
        actions: ['comment'],
        tplPath: path.normalize(__dirname + '/../../app/mailer/templates'),
        key: 'POSTMARK_KEY'
    },
    token: {
        //Auth type: 'none', 'user', 'useranddefault', 'default'
        authType: 'default',
        defaultToken: 'fc8e81b2c4555603fb77f37385306bcb'
    }
};