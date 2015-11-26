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

describe('ChallengeUserLogin Controller', function() {
    describe('adding a user', function () {
	beforeEach(function(done) {
	    mockgoose.reset();
	    done();
	})
	it('add valid user', function (done) {
	    var request  = httpMocks.createRequest({
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
	    var response = httpMocks.createResponse();
	    user_controllers.addUser(request, response).then(function(data){		
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
	     	response._getStatusCode().should.equal(400)		
	     	done()
	    })
	});


    });
});

