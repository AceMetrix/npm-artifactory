var request = require('request');
var util = require('../lib/util');
module.exports = function(req, res){
    var artPath = util.artMetaPath(req.params['packagename']);
    request.get({uri: artPath, json: true}, function(err, metaRes, body){
        if (metaRes.statusCode === 404){
            request.head('https://' + npm + artifactName, function(err, npmRes, body){
                console.log(body);
                res.end();
            });
            // check npmjs.org
            // if its there, pipe to artifactory
            // pipe to the response
        } else{
            // todo: figure out if the revision has to do with the revision of the package.json file only
            console.log(body);
            res.send(body);
        }
    });
}
