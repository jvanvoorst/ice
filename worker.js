var Alert = require('./models/alert');
var Receiver = require('./models/receiver')
var mongoose = require('mongoose');
var twilio = require('./controllers/twilio');
mongoose.connect('mongodb://localhost/ice');

var currentTime = (new Date).getTime();

// Send alerts to the alerts that are past due
function alertsDue() {
	Alert.find({ active : true }, function(err, results) {
		results.forEach( function(alert) {
			alert.find().populate('receiver').exec( function(err, response) {
				console.log(response);
			});
		});
	});
	// Alert.find({ active : true }).populate('receiver').exec( function(err, results) {
	// 	console.log(results);
	// 	// results.forEach(function(alert) {
	// 	// 	if (currentTime > alert.time) {
	// 	// 		console.log('past due', alert.trailHead);
	// 	// 		message = "User is over due from trail-head: " + alert.trailHead + "there route is: " + alert.route + "they were due at: " + new Date(alert.time);
	// 	// 		// twilio.send(message, '+13035164002');
	// 	// 		alert.active = false;
	// 	// 		alert.save();

	// 	// 	}
	// 	// });
	// });
};

// Sned warning to alerts that are whithin 1 hour of due
function alertsWarning() {
	Alert.find({ active : true }, function(err, results) {
		results.forEach( function(alert) {
			if (currentTime + 3600000 > alert.time && currentTime < alert.time) {
				console.log('almost due', alert.trailHead);
				message = "A warning will be sent out to your people at: " + new Date(alert.time) + "to cancel reply to this message with: safe"
				twilio.send(message, '+13035164002');
			}
		})
	});
};

// alertsDue();
// alertsWarning();

Alert
.find({ active : true })
.populate('receivers')
.exec(function (err, alert) {
  if (err) return handleError(err);
  alert.receivers.forEach( function(receiver) {
  	console.log(receiver.phone);
  })
})