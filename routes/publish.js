var http = require('http');
var util = require('../lib/util'); 
var request = require('request');
var crypto = require('crypto');
var config = require('../config');

// set the metadata file for package
module.exports.meta = function(req, res){
    var artMetaPath = util.artMetaPath(req.params.packagename);
    request.head({uri: artMetaPath, auth: config.artifactory.auth}, function(err, artRes, headers){
        if (artRes.statusCode === 200){
            res.send(409, {error: 'conflict', reason: 'Document update conflict'});
        } else{
            // todo: how is the revision really calculated?
            req.body['_rev'] = '1-' + crypto.createHash('md5').update(JSON.stringify(req.body)).digest('hex');
            request.put({uri: artMetaPath, json: req.body, auth: config.artifactory.auth}, function(err, artRes, body){
                res.send(201, {ok: 'created new entry'});
            });
        }
    });
}
// actually perform the upload
module.exports.artifact = function(req, res){
    // infer the packagename and packageversion from the params
    // ignore the revision?
    var filename = req.params.filename;
    var version = filename.substring(filename.lastIndexOf('-') + 1).replace('.tgz','');
    var artifactPath = util.artifactPath({
        name: req.params.packagename,
        version: version,
        file: req.params.filename
    });
    var buffer = new Buffer('');
    req.on('data', function(chunk){
        buffer = Buffer.concat([buffer, chunk]);
    });
    req.on('end', function(){
        request.put({uri: artifactPath, body: buffer, auth: config.artifactory.auth}, function(err, artRes, body){
            // todo: create a local metadatafile with timestamp and _attachments properties
            // todo: update the metadata file so that you append the version and the full body of this metadata
            res.send(201, {ok: true, id: req.params.packagename, rev: req.params.revision});
        });
    });
}
module.exports.tag = function(req, res){
    // upload res.body to the meta directory
    // update the metadata.json tag for latest to this version under dist-tags
    // {
    //   dist-tags: {latest: '0.0.2'},
    //   versions: {'0.0.1': {fullbody}, '0.0.2': {fullbody}}
    // }
    res.send(201, {ok: 'added version'});
}
