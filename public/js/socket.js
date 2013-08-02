var socket = io.connect();
socket.on('connect', function() {
	socket.on('status', function(data) {
		onlineStatus(data);
	});
	socket.on('joinin', function(){
		onlineStatus({isself: true});
	});
	socket.on('userlist', function(data) {
		//在线列表[{username:'', client''}]
		listUser(data);
	});
	socket.on('single', function(data) {
		//对我聊{from:'',to:'',msg:''}
		console.log(data);
		getMsg(data);
	});
	socket.on('room', function(data) {
		//对所有人聊{from:'',msg:''}
		console.log(data);
		getMsg(data);
	});
});
socket.on('reconnect', function() {
	systemMsg('[系统]您已经重新进入聊天室');
});
socket.on('disconnect', function() {
	systemMsg('[系统]服务器断开，正在尝试重新连接');
});
socket.on('error', function(err) {
	systemMsg('[系统]身份验证出错，请从新登录');
});
var sayToRoom = function(data){
	socket.emit('room',data);
};
var sayToSomeone = function(data){
	socket.emit('single',data)
};