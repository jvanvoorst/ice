var passport = require('passport');
var User = require('../models/user');

 // the actual login process
var performLogin = function(req, res, next, user){
    // call login and pass the user
    req.login(user, function(err){
        // If error, allow execution to move to the next middleware
        if(err) return next(err);
        // Otherwise, send authorized = true
        return res.send({authorized : true});
    });
};

var authenticationController = {

    // function to check if user is logged in
    authorized : function(req, res, next) {
        if (!req.isAuthenticated()) {
            res.send({authorized : false}); 
        }
        else next();
    },

    processLogin : function(req, res, next){
        console.log(req.body);
        // Passport's "authenticate" method returns a method, so we store it
        // in a variable and call it with the proper arguments afterwards.
        // We are using the "local" strategy defined (and used) in the
        // config/passport.js file
        var authFunction = passport.authenticate('local', function(err, user, info){
            console.log('34', user, err, info);
            // If there was an error, allow execution to move to the next middleware
            if(err) return next(err);
            // If the user was not successfully logged in due to not being in the
             // database or a password mismatch, set a flash variable to show the error
            // which will be read and used in the "login" handler above and then redirect
            // to that handler.
            if(!user) {
                console.log('42' + user)
		        return res.send({error: 'Error logging in. Please try again.'});
            }
            // If we make it this far, the user has correctly authenticated with passport
            // so now, we'll just log the user in to the system.
            performLogin(req, res, next, user);
        });
        // Now that we have the authentication method created, we'll call it here.
        authFunction(req, res, next);
    },

    processRegister : function(req, res, next){
        
        var user = new User({
            first    : req.body.first,
            last     : req.body.last,
            username    : req.body.username,
            password : req.body.password,
        });

        user.save(function(err, user){
            // If there is an error, it will come with some special codes and
            // information. We can customize the printed message based on
            // the error mongoose encounters
            if(err) {
                // If we encounter this error, the duplicate key error,
                // this means that one of our fields marked as "unique"
                // failed to validate on this object.
                if(err.code === 11000){
		            return res.send({error : 'This user already exists.'})
                }
		        else  {
			         // Generic Error
		            return res.send({error : 'An error occured, please try again'})
		        }
            }
            // If we make it this far, we are ready to log the user in.
            performLogin(req, res, next, user);
        });
    },

    profile : function(req, res) {
        res.send(req.user);
    },

    // Handle logout requests
    logout : function(req, res){
        req.logout();
        res.send('logged out');
    }
};

module.exports = authenticationController;
