var http = require('http');
var util = require('../lib/util'); 
var request = require('request');
var crypto = require('crypto');

// set the metadata file for package
module.exports.meta = function(req, res){
    var artMetaPath = util.artMetaPath(req.params.packagename);
    request.get({uri: artMetaPath, json: true}, function(err, artRes, body){
        if (artRes.statusCode === 200){
            // check for deprecation updates
            if (Object.keys(req.body.versions).length > 0){
                for (var version in body.versions){
                    if (req.body.versions[version] && body.versions[version]){
                        if (req.body.versions[version].deprecated !== body.versions[version].deprecated){
                            request.put({uri: artMetaPath, json: req.body}, function(){
                                res.send(201, {ok: "updated package metadata"});
                            });
                            return;
                        }
                    }
                }
            }

            res.send(409, {error: 'conflict', reason: 'Document update conflict'});
        } else{
            // todo: how is the revision really calculated?
            req.body['_rev'] = '1-' + crypto.createHash('md5').update(JSON.stringify(req.body)).digest('hex');
            req.body.time = {};
            req.body['_attachments'] = {};
            request.put({uri: artMetaPath, json: req.body}, function(err, artRes, body){
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
    request.get({uri: util.artMetaPath(req.params.packagename), json: true}, function(err, artRes, body){
        if (artRes.statusCode !== 200){
            res.send(500);
            return;
        }
        var buffer = new Buffer('');
        var md5 = crypto.createHash('md5');
        req.on('data', function(chunk){
            buffer = Buffer.concat([buffer, chunk]);
            md5.update(chunk);
        });
        req.on('end', function(){
            var artifactPath = util.artifactPath({
                name: req.params.packagename,
                version: version,
                file: req.params.filename
            });
            // upload the actual tarball
            request.put({uri: artifactPath, body: buffer}, function(err, artRes){
                body.time[version] = new Date().toISOString();
                body['_attachments'][filename] = {
                    'content_type': req.get('content-type'),
                    revpos: 2, // has to do with _rev?
                    digest: 'md5-' + md5.digest('base64'),
                    length: req.get('content-length'),
                    stub: true
                }

                // update the meta file
                request.put({uri: util.artMetaPath(req.params.packagename), json: body}, function(err, artRes, body){
                    res.send(201, {ok: true, id: req.params.packagename, rev: req.params.revision});
                });
            });
        });
    });
}
module.exports.tag = function(req, res){
    request.get({uri: util.artMetaPath(req.params.packagename), json: true}, function(err, artRes, body){
        if (artRes.statusCode !== 200){
            res.send(500);
            return;
        }
        // update the metadata file with the new version
        body.versions[req.params.version] = req.body;
        body['dist-tags'].latest = req.params.version;
        var requests = 0;
        request.put({uri: util.artMetaPath(req.params.packagename), json: body}, function(err, artRes, body){
            requests++;
            if (requests === 2) res.send(201, {ok: 'added version'});
        });

        // prepare the a local metadata file
        var artifactPath = util.artifactPath({
            name: req.params.packagename,
            version: req.params.version,
            file: 'metadata.json'
        });
        request.put({uri: artifactPath, json: req.body}, function(err, artRes, body){
            requests++;
            if (requests === 2) res.send(201, {ok: 'added version'});
        });
    });
}
