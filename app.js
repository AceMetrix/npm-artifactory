
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.post('/_session', routes.session);
app.get('/:packagename', routes.list);
app.get('/:packagename/:version', routes.list);
app.get('/:packagename/latest', routes.list);

app.put('/:packagename', routes.publish.meta);
app.put('/:packagename/-/:filename/-rev/:revision', routes.publish.artifact);
app.put('/:packagename/:version/-tag/latest', routes.publish.tag);
//app.put('/:packagename/:version', routes.publish);
//app.put('/:packagename/latest', routes.publish);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
