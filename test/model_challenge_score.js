var assert = require('assert');
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var mockgoose = require('mockgoose');
var mongoose = require('mongoose');
chai.use(chaiAsPromised);
var should = chai.should();

require('../config/test_database');
require('../models/ChallengeScore');
require('../models/ChallengeUserLogin');

var ChallengeScore = mongoose.model('ChallengeScore');
var ChallengeUserLogin = mongoose.model('ChallengeUserLogin');

describe('ChallengeScore', function() {
    var fake_user_1
    var fake_user_2
    beforeEach(function(done) {
	mockgoose.reset();
	var user_1_info = {local: {email: 'hi@hi.com',
				   username: 'me',
				   password: 'me_pass'},
			   displayName: 'me_display'};
	var user_2_info = {local: {email: 'hi@hi.com',
				   username: 'me2',
				   password: 'me_pass'},
			   displayName: 'me_display2'};
	var challengeuserlogin = new ChallengeUserLogin(user_1_info);
	var challengeuserlogin2 = new ChallengeUserLogin(user_2_info);	    
	challengeuserlogin.save(function(err,user){	    
	    fake_user_1 = user._id;
	    challengeuserlogin2.save(function(err,user){	    
		fake_user_2 = user._id;
		console.log(fake_user_1+" "+fake_user_2)
		done();
	    })	    
	})
    })
     this.timeout(5000);
     it('valid score', function (done) {
 	 var challengescore = new ChallengeScore({winnerId: fake_user_1,
						  machinePlayerdOnId: '1234',
						  challenge: false,
						  scorePlayers: [{
						      playerId: fake_user_1,
						      playerName: "poop",
						      winOrLose: true,
						      wins: 10,
						      losses: 1,
						      points: 55
						  }]
						 });
	 // challengescore.scorePlayers.push([{
	 //     playerId: fake_user_1,
	 //     playerName: "poop",
	 //     winOrLose: true,
	 //     wins: 10,
	 //     losses: 1,
	 //     points: 55
	 // }])
 	 // //return challengeuserlogin.save().should.be.fulfilled;
 	 challengescore.save(function(err,score){
	 //     user.should.not.be.null
	     console.log("hi there"+score)
	     done()
	 })
	 
     });
});

