var Receiver = require('../models/receiver');

var receiverController = {
	userReceivers : function(req, res) {

	        Receiver.find({ userID : req.user._id }, function(err, results) {
	            res.send(results);
	        });
    },

    addReceiver : function(req, res) {
    	var receiver = new Receiver(req.body);
    	receiver.save();
    	Receiver.find({ userID : req.user._id}, function(err, results) {
        	res.send(results);
    	})
    },

    removeReceiver : function(req, res) {
        Receiver.findByIdAndRemove(req.body.id, function(err, results) {
            if (!err) {
                Receiver.find({ userID : req.user._id}, function(err, results) {
                    res.send(results);
                });
            }
        });
    },

    editReceiver : function(req, res) {
        console.log(req.body);
        Receiver.findByIdAndUpdate(req.body._id, {
            $set : {
                name   : req.body.name,
                email  : req.body.email,
                phone  : req.body.phone,
                userID : req.body.userID,
            }
        }, function(err, results) {
            console.log(err);
            Receiver.find({ userID : req.user._id}, function(err, results) {
                res.send(results);
            });
        });
    },
};

module.exports = receiverController;
