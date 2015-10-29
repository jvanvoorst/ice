var mongoose = require('mongoose');

var receiverSchema = mongoose.Schema( {
    userID : {
        type : mongoose.Schema.ObjectId,
        ref  : 'user',
        required : true
    },
    name : {
        type     : String,
        required : true,
    },
    email : {
        type : String,
    },
    phone : {
        type : String,
    },
});

module.exports = mongoose.model('receiver', receiverSchema)