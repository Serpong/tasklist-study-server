const { TokenManager } = require('../utils/authUtil');

const accessTokenManager = TokenManager('accessToken');
const refreshTokenManager = TokenManager('refreshToken');


module.exports.verifyTokenMiddleware = (req, res, next)=>{
	if(!req.cookies.accessToken)
		return res.status(401).json({msg:"로그인이 필요합니다."});

	let accessTokenDecoded = accessTokenManager.verifyToken(req.cookies.accessToken);
	if(accessTokenDecoded){
		res.locals.userId = accessTokenDecoded.userId;
		return next();
	}

	let refreshTokenDecoded = refreshTokenManager.verifyToken(req.cookies.refreshToken);
	if(!refreshTokenDecoded)
		return res.status(401).json({msg:"토큰이 만료되었습니다."});

	if(!refreshTokenDecoded.userId)
		return res.status(401).json({msg:"비정상적인 토큰 정보입니다."});

	//여기서 userId db 체크해도됨.
	
	accessTokenManager.setToken(req, res, refreshTokenDecoded.userId);
	res.locals.userId = refreshTokenDecoded.userId;
	return next();
}