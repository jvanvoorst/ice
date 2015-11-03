var client = require('twilio')('ACbd12f37e9cb9066bf1dc6af671a38341', 'de841befddb8e50c9d66981b33672b23');

//Send an SMS text message
var twilio = {
    send : function(message, to) {
        console.log('sending...')
        to = to.replace(/-/g,'');
        to = '+1' + to;
        console.log('to: ',to);
        client.sendMessage({
            to: to, // Any number Twilio can deliver to
            from: '+17203996705', // A number you bought from Twilio and can use for outbound communication
            body: message, // body of the SMS message
        }, function(err, responseData) { //this function is executed when a response is received from Twilio
            if (!err) { // "err" is an error received during the request, if any
                // "responseData" is a JavaScript object containing data received from Twilio.
                // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                // http://www.twilio.com/docs/api/rest/sending-sms#example-1
                console.log('Twilio number: ', responseData.from); // outputs number sent to, Twilio number
                console.log('message: ', responseData.body); // outputs message body
            }
        });
    }
}

module.exports = twilio;