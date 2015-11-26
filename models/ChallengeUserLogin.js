var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//Sigh - had to search a bunch for this line
var ObjectId = mongoose.Schema.ObjectId;

//From http://stackoverflow.com/questions/46155/validate-email-address-in-javascript

var email_re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

function validateEmail(email) {
    return email_re.test(email);
}

var ChallengeUserLoginSchema = new mongoose.Schema({
    local            : {
	email        : { type: String,
			 lowercase: true,
			 match: email_re
		       },
	password     : { type: String,
			 required: true
		       },
	username     : {type: String,
			required: true,
			lowercase: true,
			maxlength: 25,
			minlength: 1
		       }
    },
    facebook         : {
	id           : String,
	token        : String,
	email        : String,
	name         : String
    },
    twitter          : {
	id           : String,
	token        : String,
	displayName  : String,
	username     : String
    },
    google           : {
	id           : String,
	token        : String,
	email        : String,
	name         : String
    },
    region: String,
    displayName: {type: String,
		  required: true,
		  maxlength: 25,
		  minlength: 1		  
		 }
});

// generating a hash
ChallengeUserLoginSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
ChallengeUserLoginSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

mongoose.model('ChallengeUserLogin', ChallengeUserLoginSchema);
