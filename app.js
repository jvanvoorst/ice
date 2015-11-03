var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

// Connect to DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ice');

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

// Application Configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Controller requires
var authenticationCntrl = require('./controllers/authentication');
var profileCntrl = require('./controllers/profileCntrl');
var receiverCntrl = require('./controllers/receiverCntrl');
var alertCntrl = require('./controllers/alertCntrl');
var twilio = require('./controllers/twilio');

// Routes
app.get('/', function(req, res){
  res.sendFile('/html/index.html', {root : './public'})
});

// Authentication routes
app.post('/auth/login', authenticationCntrl.processLogin);
app.post('/auth/register', authenticationCntrl.processRegister);
app.post('/auth/logout', authenticationCntrl.logout);

// get routes for user profile, receivers, and alerts
app.get('/api/profile', authenticationCntrl.authorized, profileCntrl.profile);
app.get('/api/userReceivers', authenticationCntrl.authorized, receiverCntrl.userReceivers);
app.get('/api/userAlerts', authenticationCntrl.authorized, alertCntrl.userAlerts);

// edit user profile
app.post('/api/editProfile', profileCntrl.editProfile);

// Receiver routes for add, edit, and remove
app.post('/api/addReceiver', receiverCntrl.addReceiver);
app.post('/api/editReceiver', receiverCntrl.editReceiver);
app.post('/api/removeReceiver', receiverCntrl.removeReceiver);

// Alert routes for add, edit, and remove
app.post('/api/addAlert', alertCntrl.addAlert);
app.post('/api/editAlert', alertCntrl.editAlert);
app.post('/api/removeAlert', alertCntrl.removeAlert);

app.post('/sms/sendMessage', twilio.send);

// Creating Server and Listening for Connections \\
var port = 3000
app.listen(port, function(){
  console.log('Server running on port ' + port);

});
