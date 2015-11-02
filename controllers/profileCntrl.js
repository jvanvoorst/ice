var User = require('../models/user');

var profileController = {
    profile : function(req, res) {
        res.send(req.user);
    },

    editProfile : function(req, res) {
        User.findOne({ _id : req.body._id }, function(err, user) {
            user.first = req.body.first;
            user.last = req.body.last;
            user.username = req.body.username;
            user.phone = req.body.phone;
            user.save();
            res.send(req.user);
        });
    },
};

module.exports = profileController;