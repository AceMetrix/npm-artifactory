var should = require('chai').should();
var express = require('express');
var npm = require('npm');

describe('get', function(){
    before(function(done){
        npm.load({registry: 'http://localhost:3000'}, done);
    });
    after(function(done){
        npm.commands.uninstall(['asdfasdfasdfasdf'], done);
    });
    it('gets the module from artifactory', function(done){
        npm.commands.install(['asdfasdfasdf'], function(err){
            should.not.exist(err);
            done();
        });
    });
});
