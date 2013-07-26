var socket = io.connect();
socket.on('connect', function() {
	socket.on('status', function(data) {
		onlineStatus(data);
	});
	socket.on('userlist', function(data) {
		//在线列表[{username:'', client''}]
		listUser(data);
	});
	socket.on('single', function(data) {
		//对我聊{from:'',to:'',msg:''}
		getMsg(data);
	});
	socket.on('group', function(data) {
		//对所有人聊{from:'',msg:''}
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
var listUser = function(userList) {
	//列出用户列表
	var aHtml = []
	for (var i = 0; i < userList.length; i++) {
		aHtml.push('<li>');
		aHtml.push('<a href="javascript:" title="' + userList[i].username + '">' + userList[i].username + '</a>');
		aHtml.push('<img src="/img/' + userList[i].client + '.png" title="' + userList[i].client + '登录"/>');
		aHtml.push('</li>');
	}
	var oHtml = $(aHtml.join(''));
	$('#chat-user-list #list').empty().append(oHtml);
};
var sayToSomeone = function() {};
var sayToAll = function() {};
var systemMsg = function(msg) {
	var oHtml = $('<marquee direction="left" behaviour="lide" loop="1" scrollamount="5"></marquee>');
	oHtml.append(msg);
	$('#system-msg').empty().append(oHtml);
};
var getMsg = function(data) {
	console.log(data);
};
var onlineStatus = function(msg) {
	var html = '';
	if (msg.status == 'ONLINE') {
		if (msg.user == $.cookie('username')) {
			html = '[系统]您已经进入聊天室';
		} else {
			html = '[系统]用户"' + msg.user + '"进入聊天室';
		}
	} else {
		html = '[系统]用户"' + msg.user + '"离开聊天室';
	}
	systemMsg(html);
};