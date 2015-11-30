var assert = require('assert');
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var mockgoose = require('mockgoose');
var mongoose = require('mongoose');
chai.use(chaiAsPromised);
var should = chai.should();

require('../config/test_database');
require('../models/ChallengeScore');
var httpMocks = require('node-mocks-http');

var score_controllers = require('../routes/score_controllers')('challenge')

describe('ChallengeScore Controller', function() {
    describe('adding a score', function () {
	beforeEach(function(done) {
	    mockgoose.reset();
	    done();
	})
	it('add valid score', function (done) {
	    var request  = httpMocks.createRequest({
		method: 'POST',
		url: '/score',
		body: {
		    seasonOrRound: 'preSeason',
		    winnerId: '565b7469de0bc8c40a5a62f6',
		    machinePlayedOnId: '12345',
		    challenge: false,
		    scorePlayers: [{
			playerId: '565b7469de0bc8c40a5a62f6',
			playerName: 'aiton goldman',
			wins: 11,
			losses: 12,
			points: 123
		    },{
			playerId: '565b7469de0bc8c40a5a62f7',
			playerName: 'aiton goldman2',
			wins: 12,
			losses: 13,
			points: 1234
		    }]
		}
	    });
	    var response = httpMocks.createResponse();
	    score_controllers.addScore(request, response).then(function(data){		
	     	response._getStatusCode().should.equal(200)		
	     	done()
	    },function(data){
	     	//When you hit this, you will see a timeout error in the results
		//THIS MEANS SOMETHING WENT WRONG
	    })
	});
	it('add empty score', function (done) {
	    var request  = httpMocks.createRequest({
		method: 'POST',
		url: '/score'
	    });
	    var response = httpMocks.createResponse();
	    score_controllers.addScore(request, response).then(function(data){		
	     	//When you hit this, you will see a timeout error in the results
		//THIS MEANS SOMETHING WENT WRONG
	    },function(data){
	     	response._getStatusCode().should.equal(400)		
		response._getData().error.should.equal('VALIDATION ERROR WHILE CREATING NEW SCORE : **challenge--ValidatorError--Path `challenge` is required.**winnerId--ValidatorError--Path `winnerId` is required.**seasonOrRound--ValidatorError--Path `seasonOrRound` is required.');
	     	done()
	    })
	});
	it('add invalid score', function (done) {
	    var request  = httpMocks.createRequest({
		method: 'POST',
		url: '/score',
		body: 
		{ dateOfScore: 'poop',
		  scorePlayers: [
		    {
			playerId: 'poop',
			wins: 'blah',
			losses: 'blah',
			points: 'blah'
		    }
		  ]
		}
	    });
	    var response = httpMocks.createResponse();
	    score_controllers.addScore(request, response).then(function(data){		
	     	//When you hit this, you will see a timeout error in the results
		//THIS MEANS SOMETHING WENT WRONG
	    },function(data){
	     	response._getStatusCode().should.equal(400)		
		response._getData().error.should.equal('VALIDATION ERROR WHILE CREATING NEW SCORE : **scorePlayers.0.points--CastError--Cast to Number failed for value "blah" at path "points"**scorePlayers.0.losses--CastError--Cast to Number failed for value "blah" at path "losses"**scorePlayers.0.wins--CastError--Cast to Number failed for value "blah" at path "wins"**scorePlayers.0.playerId--CastError--Cast to ObjectID failed for value "poop" at path "playerId"**dateOfScore--CastError--Cast to Date failed for value "poop" at path "dateOfScore"**challenge--ValidatorError--Path `challenge` is required.**winnerId--ValidatorError--Path `winnerId` is required.**seasonOrRound--ValidatorError--Path `seasonOrRound` is required.**scorePlayers.0.playerName--ValidatorError--Path `playerName` is required.');
	     	done()
	    })
	});
    });
});

