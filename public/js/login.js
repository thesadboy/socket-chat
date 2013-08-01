$(function () {
	$('#login-back').click(function(e){
		history.back();
	});
	$('#login-submit').click(function(e){
		var username = $('#login-username').val();
		if(username.trim().length < 4)
		{
			return $('#login-username').addClass('input-error');
		}
		$('#login-username').removeClass('input-error');
		$('#login-from').submit();
	});
});