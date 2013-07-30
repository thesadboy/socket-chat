var listUser = function(userList) {
	//列出用户列表
	var aHtml = []
	for (var i = 0; i < userList.length; i++) {
		if(userList[i].username === $.cookie('username'))
		{
			continue;
		}
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