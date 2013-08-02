var ua = require('mobile-agent');
var config = require('../config');
var secretUtil = require('../utils/secret-util');


exports.main = function(req, res, next)
{
	var room  = req.params.room;
	var agent = ua(req.headers['user-agent']);
	var 	token = JSON.parse(secretUtil.aesDecode(req.cookies.token, config.cookie.password));
	token.room = room;
	res.cookie('token',secretUtil.aesEncode(JSON.stringify(token),config.cookie.password),'/');
	res.render(agent.Mobile ? 'chat-m' : 'chat',{
		title : '房间：' + room,
		room : room
	});
};

exports.rooms = function(req, res, next){
	var agent = ua(req.headers['user-agent']);
	res.render(agent.Mobile ? 'rooms-m' : 'rooms',{
		title : 'WUCHAT'
	});
};

exports.login = function(req, res){
	var room  = req.body.room;
	var username = req.body.username;
	var agent = ua(req.headers['user-agent']);
	var client;
	if(agent.Mobile)
	{
		if(agent.iPhone)
		{
			client = 'IPHONE';
		}
		else if(agent.iPad)
		{
			client = 'IPAD';
		}
		else
		{
			client = 'MOBILE'
		}
		client = agent.iPhone ? "IPHONE" : client;
		client = agent.iPhone ? "IPHONE" : client;
	}
	else
	{
		if(agent.Mac)
		{
			client = agent.windows ? 'PC' : 'MAC';
		}
		else
		{
			client = 'PC';
		}
	}

	var expiry = new Date();
	expiry.setHours(expiry.getHours() + 24);
	var token = {
		username : username,
		expiryTime : expiry.getTime(),
		room : room,
		client : client
	};
	res.cookie('token',secretUtil.aesEncode(JSON.stringify(token),config.cookie.password),'/');
	res.cookie('username',username,'/');
	res.redirect('/chat/'+room);
};