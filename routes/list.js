var request = require('request');
var util = require('../lib/util');
var config = require('../config');
var http = require('http');
module.exports.meta = function(req, res){
    var artPath = util.artMetaPath(req.params.packagename);
    request.get({uri: artPath, json: true}, function(err, metaRes, body){
        if (metaRes.statusCode === 404){
            //request.get({uri: config.npm.protocol + '://' + config.npm.host + '/' + req.params.packagename, json: true}, function(err, npmRes, npmBody){
                // todo: pipe responses back to meta and the req
                // for now, just return 404
                res.send(404);
            //});
        } else{
            res.send(200, body);
        }
    });
}
module.exports.version = function(req, res){
    var versionPath = util.artifactPath({
        name: req.params.packagename,
        version: req.params.version,
        file: 'metadata.json'
    });
    request.get({uri: versionPath, json: true}, function(err, artRes, body){
        res.send(200, body);
    });
}
module.exports.artifact = function(req, res){
    var filename = req.params.filename;
    var version = filename.substring(filename.lastIndexOf('-') + 1).replace('.tgz','');
    var artPath = util.artifactPath({
        name: req.params.packagename,
        version: version,
        file: filename
    });
    http.get(artPath, function(artRes){
        artRes.on('data', function(chunk){
            res.write(chunk);
        })
        artRes.on('end', function(){
            res.end();
        });
    });
}
