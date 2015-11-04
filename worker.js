var Alert = require('./models/alert');
var Receiver = require('./models/receiver');
var User = require('./models/user');
var mongoose = require('mongoose');
var twilio = require('./controllers/twilio');
mongoose.connect('mongodb://localhost/ice');

var currentTime = (new Date).getTime();

// Send alerts for the alerts that are past due
function alertsDue() {
	Alert
	.find({ active : true })
	.populate('receivers')
	.populate('userID')
	.exec( function(err, alerts) {
		alerts.forEach( function(alert) {
			if (currentTime > alert.time) {
				alert.receivers.forEach( function(receiver) {
					message = alert.userID.first + " is over due from trail-head: " + alert.trailHead + " there route was: " + alert.route + " they were due at: " + new Date(alert.time);
					// twilio.send(message, receiver.phone);
				});
				alert.active = false;
				alert.save();
			}
		});
	});
};

alertsDue();

// Send warning for alerts that are whithin 1 hour of due
function alertsWarning() {
	people = "";
	Alert
	.find({ active : true })
	.populate('receivers')
	.populate('userID')
	.exec( function(err, alerts) {
		alerts.forEach( function(alert) {
			if (currentTime + 3600000 > alert.time && currentTime < alert.time) {
				alert.receivers.forEach( function(receiver) {
					people += receiver.name + " ";
				});
				message = "Your overdue alert for trail-head " + alert.trailHead + " will be sent out to " + people + " at " + new Date(alert.time) + "to cancel reply to this message with: safe"
				// twilio.send(message, alert.userID.phone);
			}
		});
		
	});
}

alertsWarning();