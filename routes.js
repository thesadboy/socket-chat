var chat = require('./service/chat')
exports.router = function(app){
	app.get('/',function(req,res){
		res.send('ok');
	});
	app.get('/chat',chat.main);
};