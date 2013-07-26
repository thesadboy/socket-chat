var chat = require('./service/chat');
var main = require('./service/main');
exports.router = function(app){
	app.get('/',chat.main);
};