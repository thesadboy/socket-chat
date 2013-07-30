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
	var message = new Message({msg : msg});
	message.show();
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

/*
 *以下为一些控件
 **/
var Message = function(options) {
	var defaults = {
		msg: 'Message Box',
		timeout: 1500
	};
	this.options = $.extend(defaults, options);
};
Message.prototype.setMsg = function(msg) {
	this.options.msg = msg;
}
Message.prototype.setTimeout = function(timeout) {
	this.options.timeout = timeout;
};
Message.prototype.show = function() {
	var $this = this;
	var msg = $('<div class="message"></div>');
	msg.html($this.options.msg);
	$(document.body).append(msg);
	msg.fadeIn(function() {
		setTimeout(function() {
			msg.fadeOut(function() {
				msg.remove();
			});
		}, $this.options.timeout);
	});
};