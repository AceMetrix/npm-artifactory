var request = require('request');
var util = require('../lib/util');
var config = require('../config');
var http = require('http');
var path = require('path');
var url = require('url');
var createOption = require('../lib/util').createOption;
module.exports.meta = function(req, res){
    var artPath = util.artMetaPath(req.params.packagename);
    request.head({uri: artPath, json: true}, function(err, metaRes){
        if (err || metaRes.statusCode === 404){
            var proxyPath = 'http://' + config.host + ':' + config.port;
            request.get(createOption(req), function(err, npmRes, body){
                // todo: just do the get with accepts: text/plain
                body = JSON.parse(JSON.stringify(body).replace(new RegExp(url.format(config.npm), 'g'), proxyPath));
                res.send(body);
            });
        } else{
            request.get(artPath).pipe(res);
        }
    });
}
module.exports.version = function(req, res){
    var versionPath = util.artifactPath({
        name: req.params.packagename,
        version: req.params.version,
        file: 'metadata.json'
    });
    request.head({uri: versionPath, json: true}, function(err, versionRes){
        if (err || versionRes.statusCode === 404){
            var npmRequest = request.get(createOption(req));
            npmRequest.pipe(res);
            npmRequest.pipe(request.put(versionPath));
        } else {
            request.get(artPath).pipe(res);
        }
    });
}
module.exports.artifact = function(req, res){
    var filename = req.params.filename;
    var artPath = util.artifactPath({
        name: req.params.packagename,
        version: filename.substring(filename.lastIndexOf('-') + 1).replace('.tgz',''),
        file: req.params.filename 
    });
    request.head({uri: artPath, json: true}, function(err, artifactRes){
        if (err || artifactRes.statusCode === 404){
            var npmRequest = request.get(createOption(req));
            npmRequest.pipe(res);
            npmRequest.pipe(request.put(artPath));
        } else {
            request.get(artPath).pipe(res);
        }
    });
}
