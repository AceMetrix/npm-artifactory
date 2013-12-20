var request = require('request');
var util = require('../lib/util');
var config = require('../config');
var http = require('http');
var path = require('path');
var url = require('url');
var crypto = require('crypto');
var createOption = require('../lib/util').createOption;
module.exports.meta = function(req, res){
    var artPath = util.artMetaPath(req.params.packagename);
    request.head({uri: artPath, json: true}, function(err, metaRes){
        if (!err && metaRes.statusCode !== 404){
            request.get(artPath).pipe(res);
            return;
        }

        request.get(createOption(req), function(err, npmRes, body){
            if (npmRes.statusCode === 304){
                res.send(npmRes.statusCode);
                return;
            }
            // todo: just do the get with accepts: text/plain
            var proxyPath = 'http://' + config.host + ':' + config.port;
            body = JSON.parse(JSON.stringify(body).replace(new RegExp(url.format(config.npm), 'g'), proxyPath));

            request.put({uri: artPath, body: body}, function(){
                res.send(body);
            });
        });
    });
}
module.exports.version = function(req, res){
    var versionPath = util.artifactPath({
        name: req.params.packagename,
        version: req.params.version,
        file: 'metadata.json'
    });
    request.head({uri: versionPath, json: true}, function(err, versionRes){
        if (!err && versionRes.statusCode !== 404){
            request.get(versionPath).pipe(res);
            return;
        }
        request.get(createOption(req), function(err, npmRes, body){
            // prepare local metadata file in artifact version

            // todo: just do the GET with accepts: text/plain
            var proxyPath = 'http://' + config.host + ':' + config.port;
            body = JSON.parse(JSON.stringify(body).replace(new RegExp(url.format(config.npm), 'g'), proxyPath));

            request.put({uri: versionPath, json: body}, function(){
                res.send(body);
            });
        });
    });
}
module.exports.artifact = function(req, res){
    var filename = req.params.filename;
    var artPath = util.artifactPath({
        name: req.params.packagename,
        version: filename.replace(req.params.packagename, '').replace('.tgz', '').substr(1), 
        file: req.params.filename 
    });
    request.head({uri: artPath, json: true}, function(err, artifactRes){
        if (!err && artifactRes.statusCode !== 404){
            request.get(artPath).pipe(res);
            return;
        }
        request.get({url: url.format(config.npm) + req.url, encoding: null}, function(err, npmRes, body){
            request.put({uri: artPath, body: body}, function(){
                res.send(body);
            });
        });
    });
}
