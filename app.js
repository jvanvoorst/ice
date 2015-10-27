var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

// Connect to DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ice')

var passportConfig = require('./config/passport'); // Load in our passport configuration that decides how passport actually runs and authenticates

// Create Express App Object \\
var app = express();

// Session Setup
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Application Configuration \\
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Routes \\
var authenticationCntrl = require('./controllers/authentication');

// Our get request for viewing the login page
// app.get('/auth/login', authenticationCntrl.login);

// Post received from submitting the login form
app.post('/auth/login', authenticationCntrl.processLogin);

// Post received from submitting the signup form
app.post('/auth/register', authenticationCntrl.processRegister);

// Any requests to log out can be handled at this url
app.get('/auth/logout', authenticationCntrl.logout);

app.get('/loggedIn', authenticationCntrl.loggedIn)

// This route is designed to send back the logged in user (or undefined if they are NOT logged in)
app.get('/api/profile', authenticationCntrl.authorized, function(req, res){
	res.send(req.user)
})

app.get('/', function(req, res){
  res.sendFile('/html/index.html', {root : './public'})
});

// ***** IMPORTANT ***** //
// By including this middleware (defined in our config/passport.js module.exports),
// We can prevent unauthorized access to any route handler defined after this call
// to .use()
app.use(passportConfig.ensureAuthenticated);

// Creating Server and Listening for Connections \\
var port = 3000
app.listen(port, function(){
  console.log('Server running on port ' + port);

});
