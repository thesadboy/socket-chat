var chat = require('./service/chat');
var main = require('./service/main');
var auth = require('./service/auth');
exports.router = function(app){
	app.get('/',chat.rooms);
	app.get('/chat/:room', auth.isLogin,chat.main);
	app.post('/login', chat.login);
};
