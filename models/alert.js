var mongoose = require('mongoose');

var alertSchema = mongoose.Schema( {
	userID : {
		type : mongoose.Schema.ObjectId,
		ref  : 'user'
	},
	trailHead : {
		type     : String,
		required : true,
	},
	route : {
		type     : String,
		required : true,
	},
	vehicle : {
		type : String,
	},
	vehicleLic : {
		type : String,
	},
	time : {
		type     : Number,
		required : true,
	},
	receivers : [{
        type : mongoose.Schema.ObjectId,
        ref  : 'receiver'
    }],
});

module.exports = mongoose.model('alert', alertSchema)