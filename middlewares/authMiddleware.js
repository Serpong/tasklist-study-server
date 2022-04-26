const { TokenManager } = require('../utils/authUtil');

const accessTokenManager = TokenManager('accessToken');
const refreshTokenManager = TokenManager('refreshToken');

const User = require('../models/userModel');



const setUserData = async (req, res)=>{
	if(!res.locals.user_id)
		return res.status(500).json({msg: "토큰 인증이 필요합니다."});
	
	if(res.locals.userData)
		return true;
		
	const userRow = await User.findUserByUid(res.locals.user_id);
	if(!userRow)
		return res.status(401).json({msg: "회원 인증에 실패했습니다."});
	
	res.locals.userData = {
		user_id: 	userRow._id,
		userId: 	userRow.userId,
		userName: 	userRow.userName,
		userRole: 	userRow.userRole,
	};
	
	return true;
}



module.exports.verifyTokenMW = (req, res, next)=>{
	res.locals.isLoggedIn = false;
	if(!req.cookies.accessToken)
	return next();
	
	
	let tokenData = accessTokenManager.verifyToken(req.cookies.accessToken);
	if(!tokenData){
		let tokenData = refreshTokenManager.verifyToken(req.cookies.refreshToken);
		if(!tokenData)
			return next();

		// 여기서 user_id db 검증해도됨.
		
		accessTokenManager.setToken(req, res, tokenData.user_id, tokenData.userRole);
	}

	res.locals.isLoggedIn 	= true;
	res.locals.user_id 		= tokenData.user_id;
	res.locals.userRole 	= tokenData.userRole;
	
	return next();
}

//doSetUserData: 유저데이터 db 검증하고 req.locals에 저장
module.exports.permRequired = (requiredRoleText, doSetUserData)=> async (req, res, next)=> {
	if(!res.locals.isLoggedIn)
		return res.status(401).json({msg:'로그인이 필요합니다.'});


	const roleList = {"any":0, "user":1, "admin":9};

	if(!(requiredRoleText in roleList))
		return res.status(500).json({msg:'필요한 권한이 비정상적입니다.'});

	const requiredRole 	= roleList[requiredRoleText];
	const userRole 		= (res.locals.isLoggedIn && (res.locals.userRole in roleList)) ? roleList[res.locals.userRole] : 0;

	if(userRole < requiredRole)
		return res.status(403).json({msg:'권한이 부족합니다.'});
	

	if(doSetUserData)
		await setUserData(req, res);
	
	next();
}