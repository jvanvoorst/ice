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
        Receiver.findByIdAndUpdate(req.body.id, {
            $set : {
                name : req.body.name,
                email : req.body.email,
                phone : req.body.phone,
            }
        }, function(err, results) {
            Receiver.find({ userID : req.user._id}, function(err, results) {
                res.send(results);
            });
        });
    },
};

module.exports = receiverController;
