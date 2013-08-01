var ua = require('mobile-agent');
var config = require('../config');
var secretUtil = require('../utils/secret-util');
exports.isLogin = function(req,res,next){
	var room = req.params.room;
	var agent = ua(req.headers['user-agent']);
	var cookie = req.cookies;
	var token;
	if(cookie.token)
	{
		console.log(secretUtil.aesDecode(cookie.token, config.cookie.password));
		token = JSON.parse(secretUtil.aesDecode(cookie.token, config.cookie.password));
	}
	if(!token || token.expiryTime < new Date().getTime())
	{
		return res.render(agent.Mobile ? 'login-m' : 'login',{
			title : '登录',
			room : room
		});
	}
	return next();
};