var ua = require('mobile-agent');
var config = require('../config');
var secretUtil = require('../utils/secret-util');

exports.main = function(req, res){
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
			client = 'MAC';
		}
		if(agent.Windows)
		{
			client = 'PC';
		}
		else
		{
			client = 'PC';
		}
	}
	var now = new Date();
	now.setHours(now.getHours() + 24);
	var tokenStr = '{"username":'+new Date().getTime()+',"expiryTime":'+now.getTime()+',"client":"'+client+'"}';
	res.cookie('token',secretUtil.aesEncode(tokenStr,config.cookie.password),'/');
	res.render('chat');
};