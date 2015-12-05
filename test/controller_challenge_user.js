var assert = require('assert');
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var mockgoose = require('mockgoose');
var mongoose = require('mongoose');
chai.use(chaiAsPromised);
var should = chai.should();

require('../config/test_database');
require('../models/ChallengeUserLogin');
var httpMocks = require('node-mocks-http');

var user_controllers = require('../routes/user_controllers')('local')
var score_controllers = require('../routes/score_controllers')('challenge')

var add_good_user_request  = httpMocks.createRequest({
    method: 'POST',
    url: '/user',
    body: {
	local: { email: 'me@me.com',
		 username: 'me',
		 password: 'me_pass'
	       },
	displayName: 'me_display'
    }
});

function gen_create_good_score_request(userid){
    var create_good_score_request  = httpMocks.createRequest({
	method: 'POST',
	url: '/score',
	body: {
	    seasonOrRound: 'preSeason',
	    winnerId: userid,
	    machinePlayedOnId: '12345',
	    challenge: false,
	    scorePlayers: [{
		playerId: userid,
		playerName: 'aiton goldman',
		wins: 11,
		losses: 12,
		points: 123
	    },{
		playerId: userid,
		playerName: 'aiton goldman2',
		wins: 12,
		losses: 13,
		points: 1234
	    }]
	}
    });
    return create_good_score_request
}


describe('ChallengeUserLogin Controller', function() {
    var good_user_id;
    describe('getting user info', function () {
	beforeEach(function(done) {
	    //FIXME : doesn't need to be nested
	    mockgoose.reset();
	    var response = httpMocks.createResponse();
	    user_controllers.addUser(add_good_user_request, response).then(function(data){		
		good_user_id=JSON.parse(response._getData()).result
		var create_good_score_request  = gen_create_good_score_request(good_user_id)
		response = httpMocks.createResponse();
		score_controllers.addScore(create_good_score_request, response).then(function(data){
		    response = httpMocks.createResponse();
		    score_controllers.addScore(create_good_score_request, response).then(function(data){
			done();
		    })
		})
	    })
	})
	it('get user info', function (done) {
	    var response = httpMocks.createResponse();
	    var request  = httpMocks.createRequest({
		method: 'GET',
		url: '/user/'+good_user_id,
		params: {userid: good_user_id}
	    });	    
	    user_controllers.getUserInfo(request, response).then(function(data){		
		response._getStatusCode().should.equal(200);		
		JSON.parse(response._getData()).results.user.displayName.should.equal('me_display')
		JSON.parse(response._getData()).results.score.wins.should.equal(12)
		done()
	    })
	})
    })
    describe('editing a user', function () {
	beforeEach(function(done) {
	    mockgoose.reset();
	    var response = httpMocks.createResponse();
	    user_controllers.addUser(add_good_user_request, response).then(function(data){		
	     	good_user_id=JSON.parse(response._getData()).result
	     	done()
	    })
	})
	it('edit user email', function (done) {
	    var response = httpMocks.createResponse();
	    var request  = httpMocks.createRequest({
		method: 'PUT',
		url: '/user/'+good_user_id+'/email',
		body: { email: 'me@me.com' },
		params: {userid: good_user_id}
	    });	    
	    user_controllers.updateUserEmail(request, response).then(function(err){		
	     	response._getStatusCode().should.equal(200);		
	     	done();
	    },function(data){
	     	//When you hit this, you will see a timeout error in the results
		//THIS MEANS SOMETHING WENT WRONG
	    })
	});
	it('edit user email with no email', function (done) {
	    var response = httpMocks.createResponse();
	    var request  = httpMocks.createRequest({
		method: 'PUT',
		url: '/user/'+good_user_id+'/email',
		body: { email: ''},
		params: {userid: good_user_id}
	    });	    
	    user_controllers.updateUserEmail(request, response).then(function(data){		
	     	//When you hit this, you will see a timeout error in the results
		//THIS MEANS SOMETHING WENT WRONG
	    },function(data){
	     	response._getStatusCode().should.equal(400);		
		response._getData().error.should.equal('VALIDATION ERROR WHILE PERFORMING USER OPERATION : **local.email--ValidatorError--Path `email` (``) is shorter than the minimum allowed length (2).');
   		done();
	    })
	});
	it('edit user display name', function (done) {
	    var response = httpMocks.createResponse();
	    var request  = httpMocks.createRequest({
		method: 'PUT',
		url: '/user/'+good_user_id+'/displayname',
		body: { displayName: 'testDisplayName' },
		params: {userid: good_user_id}
	    });	    
	    user_controllers.updateUserDisplayName(request, response).then(function(data){		
	     	response._getStatusCode().should.equal(200);		
	     	done();
	    },function(data){
	     	//When you hit this, you will see a timeout error in the results
		//THIS MEANS SOMETHING WENT WRONG
	    })
	});
	it('edit user displayname with no displayname', function (done) {
	    var response = httpMocks.createResponse();
	    var request  = httpMocks.createRequest({
		method: 'PUT',
		url: '/user/'+good_user_id+'/displayname',
		body: { displayName: ''},
		params: {userid: good_user_id}
	    });	    
	    user_controllers.updateUserDisplayName(request, response).then(function(data){		
	     	//When you hit this, you will see a timeout error in the results
		//THIS MEANS SOMETHING WENT WRONG
	    },function(data){
	     	response._getStatusCode().should.equal(400);				
		response._getData().error.should.equal('VALIDATION ERROR WHILE PERFORMING USER OPERATION : **displayName--ValidatorError--Path `displayName` is required.')
   		done();
	    })
	});
    });
    describe('adding a user', function () {
	beforeEach(function(done) {
	    mockgoose.reset();
	    done();
	})
	it('add valid user', function (done) {

	    var response = httpMocks.createResponse();
	    user_controllers.addUser(add_good_user_request, response).then(function(data){		
	     	response._getStatusCode().should.equal(200)		
	     	done()
	    },function(data){
	     	//When you hit this, you will see a timeout error in the results
		//THIS MEANS SOMETHING WENT WRONG
	    })
	});
	it('add invalid user', function (done) {
	    var request  = httpMocks.createRequest({
		method: 'POST',
		url: '/user',
		body: {
		    local: { email: 'meme.com',
			     username: 'me1234567889012345678890123456788901234567889012345678890',
			     password: 'me_pass'
			   },
		    displayName: 'me_display1234567889012345678890123456788901234567889012345678890'
		}
	    });
	    var response = httpMocks.createResponse();
	    user_controllers.addUser(request, response).then(function(data){		
	     	//When you hit this, you will see a timeout error in the results
		//THIS MEANS SOMETHING WENT WRONG
	    },function(data){
//		console.log(response._getData());
	     	response._getStatusCode().should.equal(400)		
		response._getData().error.should.equal('VALIDATION ERROR WHILE PERFORMING USER OPERATION : **displayName--ValidatorError--Path `displayName` (`me_display1234567889012345678890123456788901234567889012345678890`) is longer than the maximum allowed length (25).**local.username--ValidatorError--Path `username` (`me1234567889012345678890123456788901234567889012345678890`) is longer than the maximum allowed length (25).**local.email--ValidatorError--Path `email` is invalid (meme.com).')
	     	done()
	    })
	});


    });
});

