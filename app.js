var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , config = require('./config')
  , cluster = require('cluster');

cluster.on('exit', function(worker){
    console.log('Worker ' + worker.id + ' died');
    cluster.fork();
});

if (cluster.isMaster){
    var count = require('os').cpus().length;
    for (var i = 0; i < count; i++){
        cluster.fork();
    }
} else {
    var app = express();

    app.set('port', process.env.PORT || config.port || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.methodOverride());
    app.use(app.router);

    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
    }
    app.put('/-/user/org.couchdb.user:*', routes.user.add);
    app.get('/-/user/org.couchdb.user:*', routes.user.get);
    app.post('/_session', routes.user.login);

    app.get('/:packagename', routes.get.meta);
    app.get('/:packagename/:version', routes.get.version);
    app.get('/:packagename/-/:filename', routes.get.artifact);

    app.put('/:packagename', [express.bodyParser()], routes.publish.meta);
    app.put('/:packagename/-/:filename/-rev/:revision', routes.publish.artifact);
    app.put('/:packagename/:version/-tag/latest', [express.bodyParser()], routes.publish.tag);

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
}
