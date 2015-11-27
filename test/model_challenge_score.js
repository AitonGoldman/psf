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

    var good_score = new ChallengeScore({/*winnerId: fake_user_1,*/
	machinePlayerdOnId: '1234',
	challenge: false,
	seasonOrRound: 'pre-season',
	scorePlayers: [{
	    playerName: "poop",
	    wins: 10,
	    losses: 1,
	    points: 55
	},{
	    playerName: "poop2",
	    wins: 11,
	    losses: 11,
	    points: 15
	}]
    });
    
    var bad_score = new ChallengeScore({/*winnerId: fake_user_1,*/
	machinePlayerdOnId: '1234',
	scorePlayers: [{
	    wins: 'aa',
	    losses: 'bb',
	    points: 'cc'
	},{
	    playerName: "poop2",
	    wins: 'aa',
	    losses: 'bb',
	    points: 'cc'
	}]
    });
    
    
    
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
	    good_score.winnerId=fake_user_1;
	    good_score.scorePlayers[0].playerId=fake_user_1;
	    good_score.scorePlayers[1].playerId=fake_user_1;
	    bad_score.winnerId='notreal';
	    bad_score.scorePlayers[0].playerId='notreal';
	    bad_score.scorePlayers[1].playerId='notreal';
	    challengeuserlogin2.save(function(err,user){	    
		fake_user_2 = user._id;
		done();
	    })	    
	})
    })
     it('valid score', function (done) {
 	 good_score.save(function(err,score){
	     score.should.not.be.null
	     done()
	 })	 
     });
     it('invalid score', function (done) {
 	 bad_score.save(function(err,score){
	     err.should.not.be.null
	     done()
	 })	 
     });

});

