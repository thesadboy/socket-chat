/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'),
	socket = require('./service/socket'),
	routes = require('./routes');
	path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.set('env','production');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

var server = http.createServer(app),
	io = require('socket.io').listen(server);
	io.set('log level', 0)

socket.socketUtil(io);
routes.router(app);

server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
