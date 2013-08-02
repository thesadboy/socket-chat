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
		if (!clients[token.username + '@' + token.room]) {
			//发送上线广播
			onlineStatus(token,'ONLINE');
			//通知进入自己进入房间
			getInRoom(socket);
		}
		socket.join(token.room);
		clients[token.username + '@' + token.room] = {
			username : token.username,
			socket: socket,
			client: token.client,
			room : token.room
		};
		console.log('---------------------')
		console.log(clients);
		//更新用户列表
		userList(token.room);
		//删除待下线用户列表的该条记录
		delete lostClients[token.username + '@' + token.room];
		socket.on('disconnect', function() {
			//添加到待下线列表中
			lostClients[token.username + '@' + token.room] = clients[token.username + '@' + token.room];
			//在设定的时间内还未重新连接的视为下线
			setTimeout(function() {
				offline(token);
			}, config.socket.offline_timeout);
		});
		socket.on('single',function(data){
			sayToSomone(token.username, data.to, token.room, data.msg);
		});
		socket.on('room',function(data){
			sayToRoom(token.username, token.room, data.msg);
		});
	});
};
var offline = function(token) {
	if (lostClients[token.username + '@' + token.room]) {
		delete lostClients[token.username + '@' + token.room];
		delete clients[token.username + '@' + token.room];
		console.warn('User "%s" offline from room "%s".', token.username, token.room);
		//发送下线广播
		onlineStatus(token,'OFFLINE');
		//更新用户列表
		userList(token.room);
	}
};
var userList = function(room) {
	var userList = [];
	for (i in clients) {
		if(clients[i].room === room)
		{
			userList.push({
				username: clients[i].username,
				client: clients[i].client
			});
		}
	}
	userList.reverse();
	io.sockets.in(room).emit('userlist', userList);
};
var sayToSomone = function(from, to, room, msg){
	console.log(arguments);
	clients[to+'@'+room].socket.emit('single',{
		from : from,
		msg : msg,
		to : to
	});
};
var sayToRoom = function(from, room, msg){
	io.sockets.in(room).emit('room',{
		from : from,
		msg : msg
	});
};
var systemMsg = function(room, msg){
	if(room)
	{
		return io.sockets.in(room).emit('system',{
			msg : msg
		});
	}
	io.sockets.emit('system',{
		msg : msg
	});
};
var onlineStatus = function(token, status){
	io.sockets.in(token.room).emit('status',{
		user : token.username,
		status : status
	});
};
var getInRoom = function(socket){
	socket.emit('joinin');
};