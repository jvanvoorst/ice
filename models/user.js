var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema( {
    first : {
        type     : String,
        required : true,
    },
    last : {
        type     : String,
        required : true,
    },
    username : {
        type     : String,
        required : true,
        unique   : true
    },
    phone : {
        type     : String,
        required : true,
        unique   : true
    },
    password : {
        type     : String,
        required : true
    },
});

userSchema.pre('save', function(next){

    if(!this.isModified('password')) return next();
    
    var user = this;

    bcrypt.genSalt(10, function(err, salt){
        if(err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);
            user.password = hash;
            return next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, next){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return next(err);
        return next(null, isMatch);
    });
};

module.exports = mongoose.model('user', userSchema)