var crypto = require('crypto');
//加密
exports.aesEncode = function(str, password){
	var cipher = crypto.createCipher('aes192', password);
	var enc = cipher.update(str, 'utf8', 'hex');
	enc += cipher.final('hex');
	return enc;
};
//解密
exports.aesDecode = function(str, password){
	var decipher = crypto.createDecipher('aes192', password);
	var dec = decipher.update(str, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
};