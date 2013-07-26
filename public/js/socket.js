var socket = io.connect();
socket.on('connect', function() {
	userSuccess();
});
socket.on('error', function(err) {
	userError(err);
});
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
var listUser = function(userList){
	console.log(userList);
};
var sayToSomeone = function(){};
var sayToAll = function(){};
var systemMsg = function(){};
var getMsg = function(data){
	console.log(data);
};
var onlineStatus = function(msg){
	console.log(msg);
};
var userSuccess = function(){
	console.log('success');
};
var userError = function(err){
	console.log(err);
};