let express = require('express'),
    util = require('util'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    GitHubStrategy = require('passport-github2').Strategy;

let app = express();

let GITHUB_CLIENT_ID = process.env.GHID;
let GITHUB_CLIENT_SECRET = process.env.GHSECRET;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET
    },
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));

app.use(compression());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({secret: 'public'}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', require('./server/routes/github.js')());

app.get('/', ensureAuthenticated, (req, res) => {
    res.redirect('/index.html');
});

app.use(express.static(__dirname + '/public'));

app.get('/auth/github',
    passport.authenticate('github', {scope: ['user:email']}),
    function (req, res) {
    });

app.get('/auth/github/callback',
    passport.authenticate('github', {failureRedirect: '/user/login.html'}),
    function (req, res) {
        res.redirect('/');
    });

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

var port = 8080;
app.listen(port);
console.log('Express server started on port %s', port);

function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/login.html');
}
