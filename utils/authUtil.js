const jwt = require('jsonwebtoken');


const TokenManager = (tokenType) => {
	if(["accessToken","refreshToken"].includes(tokenType) == false){
		throw new Error(`not valid tokenType: ${tokenType}`);
		return;
	}

	const _tokenType	= tokenType;
	const _tokenSecret 	= (_tokenType=="accessToken"? process.env.JWT_ACCESS_SECRET	: process.env.JWT_REFRESH_SECRET);
	const _tokenExp 	= (_tokenType=="accessToken"? process.env.JWT_ACCESS_EXP 	: process.env.JWT_REFRESH_EXP);
	
	const _this = {
		createToken: (userUid, userRole) => {
			return jwt.sign({
				userUid, userRole
			}, _tokenSecret, {
				expiresIn: _tokenExp
			});
		},
		verifyToken: (token) => {
			try{
				const tokenDecoded = jwt.verify(token, _tokenSecret);
				if(tokenDecoded && tokenDecoded.userUid && tokenDecoded.userRole)
					return tokenDecoded;
				else
					return false;
			}
			catch(e){
				return false;
			}
		},
		setToken: (req, res, userUid, userRole)=>{
			const newToken = _this.createToken(userUid, userRole);
			req.cookies[_tokenType]=newToken;
			res.cookie( _tokenType, newToken);
		}
	};
	return _this;
}


module.exports = { TokenManager };