var config = require('../config');
var path = require('path');

var host = config.artifactory.protocol + '://' + config.artifactory.host + '/artifactory/simple';
var repos = config.artifactory['ext-repo'];

module.exports.reverseDomain = function(domain){
    return domain.split('.').reverse().join('.');
}
module.exports.artifactPath = function(artifact){
    artifact.file = artifact.file || '';
    artifact.group = artifact.group || exports.reverseDomain(config.npm.registry);
    return host + '/' + path.join(repos, artifact.group.replace(/\./g,'/'), artifact.name, artifact.version, artifact.file);
}
module.exports.artMetaPath = function(artifactName){
    return exports.artifactPath({
        name: artifactName,
        version: '_meta',
        file: 'metadata.json'
    });
}

