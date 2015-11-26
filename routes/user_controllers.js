
function outputValidationError(err){
    error_message = "VALIDATION ERROR WHILE CREATING NEW USER : "
    for(i in err.errors){
	error_message = error_message + ('**'+i+"--"+err.errors[i].name+"--"+err.errors[i].message)
    }
    return error_message
}
module.exports = function(login_type){
    var mongoose = require('mongoose');
    require('../models/ChallengeUserLogin');
    var ChallengeUserLogin = mongoose.model('ChallengeUserLogin');
    controllers = {};
    if(login_type == 'local'){
	controllers = {
	    addUser: function(req,res,next){
		var challengeuserlogin = new ChallengeUserLogin(req.body);
		return challengeuserlogin.save(function(err, user){
		    //return challengeuserlogin.save().then(function(err, user){
		    if(err){
			res.status(400).send({result: false,
					      error: outputValidationError(err)
					     })
			return false
		    }
		    res.json({result:true});
		    return true
		})
	    }
	}
    }
    return controllers;
}
