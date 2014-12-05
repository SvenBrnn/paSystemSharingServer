var path = require('path');

/**
 * Expose
 */
module.exports = {
    //If you use mongohq this should be ok
    db: process.env.MONGOHQ_URL,

    //Social login stuff - needed later
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
    //Nodifyer settings - not used yet
    notifier: {
        service: 'postmark',
        APN: false,
        email: true, // true
        actions: ['comment'],
        tplPath: path.normalize(__dirname + '/../../app/mailer/templates'),
        key: 'POSTMARK_KEY'
    },
    //SystemShare token settings for your app
    token: {
        //Auth type: 'none', 'user', 'useranddefault', 'default'
        authType: 'default',
        defaultToken: 'SOMETOKEN'
    }
};