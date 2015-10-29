var Alert = require('../models/alert');

var alertController = {   
     userAlerts : function(req, res) {
        Alert.find({ userID : req.user._id }, function(err, results) {
            res.send(results);
        });
    }, 

    addAlert : function(req, res) {
        console.log(req.body);
        var alert = new Alert(req.body);
        alert.save();
        Alert.find({ userID : req.user._id}, function(err, results) {
            res.send(results);
        });
    },

    removeAlert : function(req, res) {
        Alert.findByIdAndRemove(req.body.id, function(err, results) {
            if (!err) {
                Alert.find({ userID : req.user._id}, function(err, results) {
                    res.send(results);
                });
            }
        });
    },

    editAlert : function(req, res) {
        Alert.findByIdAndUpdate(req.body.id, {
            $set : {
                trailHead : req.body.trailHead,
                route     : req.body.route,
                time      : req.body.time,
                receivers : req.body.receivers,
            }
        }, function(err, results) {
            Alert.find({ userID : req.user._id}, function(err, results) {
                res.send(results);
            });
        });
    },
};

module.exports = alertController;