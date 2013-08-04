var should = require('chai').should();
var express = require('express');
var npm = require('npm');

describe.skip('session', function(){
    before(function(done){
        npm.load({registry: 'http://localhost:3000'}, done);
    });
    it('logs the user in', function(done){
        npm.commands.login(function(err){
            should.not.exist(err);
            done();
        });
    });
});
