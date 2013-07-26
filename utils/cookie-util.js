exports.cookieParse = function(cookie){
	var oCookie = {};
	var cookies = cookie.split(';');
	for(var i = 0; i < cookies.length; i ++)
	{
		var aCookie = cookies[i].split('=');
		oCookie[aCookie[0].replace(/[ ]/gim,'')] = aCookie[1];
	}
	return oCookie;
}