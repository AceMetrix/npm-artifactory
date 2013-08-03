var config = require('../config');
var url = require('url');
var request = require('request');
module.exports.add = function(req, res){
    req.pipe(request.put(createOption(req))).pipe(res);
};
module.exports.get = function(req, res){
    req.pipe(request.get(createOption(req))).pipe(res);
}
module.exports.login = function(req, res){
    req.pipe(request.post(createOption(req))).pipe(res);
}
function createOption(req){
    var options = {
        uri: url.format(config.npm) + req.url,
        //proxy: 'http://localhost:9999',
        json: req.body,
        headers: req.headers
    };
    options.headers.host = config.npm.host;
    return options;
}
