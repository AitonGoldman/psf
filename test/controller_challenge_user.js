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

describe('ChallengeUserLogin Controller', function() {
    var good_user_id;
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

