var Alert = require('../models/alert');

var alertController = {   
     userAlerts : function(req, res) {
        Alert.find({ userID : req.user._id }, function(err, results) {
            res.send(results);
        });
    }, 

    addAlert : function(req, res) {
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
        Alert.findByIdAndUpdate(req.body._id, {
            $set : {
                trailHead  : req.body.trailHead,
                route      : req.body.route,
                vehicle    : req.body.vehicle,
                vehicleLic : req.body.vehicleLic,
                time       : req.body.time,
                receivers  : req.body.receivers,
                active     : req.body.active,
            }
        }, function(err, results) {
            console.log(err);
            Alert.find({ userID : req.user._id}, function(err, results) {
                res.send(results);
            });
        });
    },
    cancelAlert : function(req, res) {
        console.log(req.body);
        // Alert.findByIdAndUpdate(req.body.?, {
        //     set : {
        //         active : false,
        //     }
        // }, function(err, results) {

        // });
    },
};

module.exports = alertController;