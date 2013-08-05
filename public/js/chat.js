var sendTo = 'room';
$(function () {
	$('#chat-user-toggle-btn').click(function (e) {
		$('#chat-right').toggleClass('chat-right-show');
	});
	initSendTo();
	//切换发送对象
	$('#say-to div.btn').click(function(e){
		if($(this).attr('to') == '-1')
		{
			return;
		}
		$.cookie('send-to', $(this).attr('to'));
		initSendTo();
	});
	//点击主页按钮
	$('#home').click(function(e){
		$.cookie('send-to','');
		window.location.href = '/';
	});
	//点击发送按钮
	$('#btn-send').click(function(e){
		sendMsg();
	});
	//Enter键发送
	$('#editor').keypress(function(e){
		if(e.keyCode == 13)
		{
			sendMsg();
		}
	});
});
var sendMsg = function(){
	var data = {};
	if(sendTo === 'room')
	{
		data.msg = $('#editor').val();
		sayToRoom(data);
	}
	else
	{
		data.to = sendTo,
		data.msg = $('#editor').val();
		sayToSomeone(data);
		getMsg(data, true);
	}
	$('#editor').val('');
};
var initSendTo = function(){
	//初始化发送对象
	sendTo = $.cookie('send-to');
	if($.cookie('send-to') != undefined && $.cookie('send-to').trim() != 'room' && $.cookie('send-to').trim().length > 0)
	{
		$('#to-single').attr('to', $.cookie('send-to')).attr('title', 'To: '+ $.cookie('send-to')).html($.cookie('send-to'));
	}
	if($('#say-to div.btn[to="'+sendTo+'"]').length < 1)
	{
		sendTo = 'room';
	}
	$('#say-to div.btn').addClass('btn-dark');
	$('#say-to div.btn[to="'+sendTo+'"]').removeClass('btn-dark');
};
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
		aHtml.push('<img src="/img/clients/' + userList[i].client + '.png" title="' + userList[i].client + '登录"/>');
		aHtml.push('</li>');
	}
	var oHtml = $(aHtml.join(''));
	oHtml.find('a').click(function(){
		$.cookie('send-to', $(this).attr('title'));
		initSendTo();
	});
	$('#chat-user-list #list').empty().append(oHtml);
};
var sayToSomeone = function() {};
var sayToAll = function() {};
var systemMsg = function(msg) {
	var oHtml = $('<marquee direction="left" behaviour="lide" loop="1" scrollamount="5"></marquee>');
	oHtml.append(msg);
	$('#system-msg').empty().append(oHtml);
};
var getMsg = function(data, isLocal) {
	var now = new Date();
	var time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
	var html;
	if(isLocal)
	{
		html = '<div class="message-row"><div class="message-header">我在['+time+']对'+data.to+'说：</div><div class="message-content">'+data.msg+'</div></div>' ;
	}
	else
	{
		html = data.type === 'room' ? '<div class="message-row"><div class="message-header">'+(data.from==$.cookie("username") ? "我" : data.from )+'在['+time+']说：</div><div class="message-content">'+data.msg+'</div></div>' : '<div class="message-row"><div class="message-header">'+data.from+'在['+time+']对我说：</div><div class="message-content">'+data.msg+'</div></div>' ;
	}
	$('#left-content-container').append(html);
	$('#left-content-container').scrollTop($('#left-content-container')[0].scrollHeight);
};
var onlineStatus = function(msg) {
	var html = '';
	if(msg.isself)
	{
			html = '[系统]您已经进入聊天室';
	}
	else
	{
		if (msg.status == 'ONLINE') {
				html = '[系统]用户"' + msg.user + '"进入聊天室';
		} else {
			html = '[系统]用户"' + msg.user + '"离开聊天室';
		}
	}
	systemMsg(html);
};