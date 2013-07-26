var cookieUtil = require('../utils/cookie-util');
var config = require('../config');
var secretUtil = require('../utils/secret-util');
var clients = {};
var lostClients = {};
var io;
exports.socketUtil = function(socketIo) {
	io = socketIo;
	io.configure(function() {
		io.set('authorization', function(handshakeData, accept) {
			if (handshakeData.headers.cookie) {
				handshakeData.cookie = cookieUtil.cookieParse(handshakeData.headers.cookie);
				if (handshakeData.cookie.token) {
					var token = secretUtil.aesDecode(handshakeData.cookie.token, config.cookie.password);
					token = JSON.parse(token);
					var now = new Date().getTime();
					//判定token是否过期
					if (now <= token.expiryTime) {
						return accept(null, true);
					}
				}
			}
			accept({
				errorCode: -1,
				errorMsg: 'Token 无效'
			});
		});
	});
	io.on('connection', function(socket) {
		socket.cookie = cookieUtil.cookieParse(socket.manager.handshaken[socket.id].headers.cookie);
		var token = JSON.parse(secretUtil.aesDecode(socket.cookie.token, config.cookie.password));
		if (!clients[token.username]) {
			//发送上线广播
			onlineStatus(token.username,'ONLINE');
		}
		clients[token.username] = {
			socket: socket,
			client: token.client
		};
		//更新用户列表
		userList();
		//删除待下线用户列表的该条记录
		delete lostClients[token.username];
		//自动重连
		socket.on('reconnect', function() {
			clients[token.username] = {
				socket: socket,
				client: token.client
			};
			//删除待下线用户列表的该条记录
			delete lostClients[token.username];
		});
		socket.on('disconnect', function() {
			//添加到待下线列表中
			lostClients[token.username] = clients[token.username];
			//在设定的时间内还未重新连接的视为下线
			setTimeout(function() {
				offline(token.username);
			}, config.socket.offline_timeout);
		});
		socket.on('single',function(data){
			sayToSomone(data.from, data.to, data.msg);
		});
		socket.on('group',function(data){
			sayToAll(data.from, data.msg);
		});
	});
};
var offline = function(user) {
	if (lostClients[user]) {
		delete lostClients[user];
		delete clients[user];
		console.warn('User "%s" offline.', user);
		//发送下线广播
		onlineStatus(user,'OFFLINE');
		//更新用户列表
		userList();
	}
};
var userList = function() {
	var userList = [];
	for (i in clients) {
		userList.push({
			username: i,
			client: clients[i].client
		});
	}
	io.sockets.emit('userlist', userList);
};
var sayToSomone = function(from, to, msg){
	clients[to].emit('single',{
		from : from,
		msg : msg
	});
};
var sayToAll = function(from, msg){
	io.sockets.emit('group',{
		from : from,
		msg : msg
	});
};
var systemMsg = function(msg){
	io.sockets.emit('system',{
		msg : msg
	});
};
var onlineStatus = function(user, status){
	io.sockets.emit('status',{
		user : user,
		status : status
	});
};