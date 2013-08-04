var config = require('../config');
var url = require('url');
var request = require('request');
var createOption = require('../lib/util').createOption;

module.exports.add = function(req, res){
    req.pipe(request.put(createOption(req))).pipe(res);
};
module.exports.get = function(req, res){
    req.pipe(request.get(createOption(req))).pipe(res);
}
module.exports.login = function(req, res){
    req.pipe(request.post(createOption(req))).pipe(res);
}
