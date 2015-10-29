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

app.get('/', function(req, res){
  res.sendFile('/html/index.html', {root : './public'})
});

app.post('/auth/login', authenticationCntrl.processLogin);

app.post('/auth/register', authenticationCntrl.processRegister);

app.post('/auth/logout', authenticationCntrl.logout);

app.get('/api/profile', authenticationCntrl.authorized, authenticationCntrl.profile);

app.post('/api/saveEdit', authenticationCntrl.saveEdit);

app.post('/api/addReceiver', authenticationCntrl.addReceiver);

app.post('/api/removeReceiver', authenticationCntrl.removeReceiver);

app.post('/api/editReceiver', authenticationCntrl.editReceiver);

// Creating Server and Listening for Connections \\
var port = 3000
app.listen(port, function(){
  console.log('Server running on port ' + port);

});
