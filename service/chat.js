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
			client = agent.windows ? 'PC' : 'MAC';
		}
		else
		{
			client = 'PC';
		}
	}
	var now = new Date();
	var user = now.getTime();
	now.setHours(now.getHours() + 24);
	var tokenStr = '{"username":'+user+',"expiryTime":'+now.getTime()+',"client":"'+client+'"}';
	res.cookie('token',secretUtil.aesEncode(tokenStr,config.cookie.password),'/');
	res.cookie('username',user,'/');
	res.render(agent.Mobile ? 'chat-m' : 'chat');
};