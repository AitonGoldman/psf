var assert = require('assert');
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var mockgoose = require('mockgoose');
var mongoose = require('mongoose');
chai.use(chaiAsPromised);
var should = chai.should();

require('../config/test_database');
require('../models/ChallengeUserLogin');

var ChallengeUserLogin = mongoose.model('ChallengeUserLogin');

describe('ChallengeUserLogin', function() {
    describe('email validator', function () {
	beforeEach(function(done) {
	    mockgoose.reset();
	    done();
	})
	this.timeout(5000);
	it('valid user', function (done) {
	    var challengeuserlogin = new ChallengeUserLogin({local: {email: 'hi@hi.com',username: 'me', password: 'me_pass'}, displayName: 'me_display'});	    
	    //return challengeuserlogin.save().should.be.fulfilled;
	    challengeuserlogin.save(function(err,user){
		user.should.not.be.null
		done()
	    })
	});
	it('invalid username - missing', function (done) {
	    var challengeuserlogin = new ChallengeUserLogin({local: {email: 'hi@hi.com', password: 'me_pass'}, displayName: 'me_display'});	    
	    //return challengeuserlogin.save().should.be.fulfilled;
	    challengeuserlogin.save(function(err,user){
		err.should.not.be.null
		done()
	    })
	});
	it('invalid displayname - missing', function (done) {
	    var challengeuserlogin = new ChallengeUserLogin({local: {email: 'hi@hi.com',username: 'me', password: 'me_pass'}});	    
	    //return challengeuserlogin.save().should.be.fulfilled;
	    challengeuserlogin.save(function(err,user){
		err.should.not.be.null
		done()
	    })
	});

	it('invalid displayName - long name', function (done) {
	    var challengeuserlogin = new ChallengeUserLogin({local: {email: 'hi@hi.com',username: 'me', password: 'me_pass'}, displayName: '123456789012345678901234567890'});	    
	    //return challengeuserlogin.save().should.be.fulfilled;
	    challengeuserlogin.save(function(err,user){
		err.should.not.be.null
		done()
	    })
	});
	it('invalid displayName - short name', function (done) {
	    var challengeuserlogin = new ChallengeUserLogin({local: {email: 'hi@hi.com',username: 'me', password: 'me_pass'}, displayName: ''});	    
	    //return challengeuserlogin.save().should.be.fulfilled;
	    challengeuserlogin.save(function(err,user){
		err.should.not.be.null
		done()
	    })
	});
	it('invalid password', function (done) {
	    var challengeuserlogin = new ChallengeUserLogin({local: {email: 'hi@hi.com',username: 'me'}, displayName: 'me_display'});	    
	    //return challengeuserlogin.save().should.be.fulfilled;
	    challengeuserlogin.save(function(err,user){
		err.should.not.be.null
		done()
	    })
	});
	it('invalid username - short name', function (done) {
	    var challengeuserlogin = new ChallengeUserLogin({local: {email: 'hi@hi.com',username: '', password: 'me_pass'}, displayName: 'me_display'});	    
	    //return challengeuserlogin.save().should.be.fulfilled;
	    challengeuserlogin.save(function(err,user){
		err.should.not.be.null
		done()
	    })
	});
	it('invalid username - long name', function (done) {
	    var challengeuserlogin = new ChallengeUserLogin({local: {email: 'hi@hi.com',username: '123456789012345678901234567890', password: 'me_pass'}, displayName: 'me_display'});	    
	    //return challengeuserlogin.save().should.be.fulfilled;
	    challengeuserlogin.save(function(err,user){
		err.should.not.be.null
		done()
	    })
	});
	it('invalid email', function (done) {
	    var challengeuserlogin = new ChallengeUserLogin({local: {email: 'hihi.com',username: 'me', password: 'me_pass'}, displayName: 'me_display'});	    
	    //return challengeuserlogin.save().should.be.fulfilled;
	    challengeuserlogin.save(function(err,user){
		err.should.not.be.null
		done()
	    })
	});
    });
});

