var config = require('../config');
var url = require('url');
module.exports = function(req, res){
    // excellent opportunity to pipe instead
    // stub the login
    res.cookie('AuthSession', 'npm-artifactorysession; Version=1', {path: '/', httpOnly: true, maxAge: 36000000});
    res.set('cache-control', 'must-revalidate');
    res.set('date', new Date().toUTCString());
    res.send({ok: true, name: req.body.name, roles: []});
}
