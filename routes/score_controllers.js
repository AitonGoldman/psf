
function outputValidationError(err){
    error_message = "VALIDATION ERROR WHILE CREATING NEW USER : "
    for(i in err.errors){
	error_message = error_message + ('**'+i+"--"+err.errors[i].name+"--"+err.errors[i].message)
    }
    return error_message
}
module.exports = function(score_type){
    var mongoose = require('mongoose');
    require('../models/ChallengeScore');
    var ChallengScore = mongoose.model('ChallengeScore');
    controllers = {};
    if(score_type == 'challenge'){
	controllers = {
	    addScore: function(req,res,next){
		var challengescore = new ChallengeScore(req.body);
		return challengescore.save(function(err, score){
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
