const { TokenManager } = require('../utils/authUtil');

const accessTokenManager = TokenManager('accessToken');
const refreshTokenManager = TokenManager('refreshToken');

const User = require('../models/userModel');



const setUserData = async (req, res)=>{
	if(!res.locals.userUid)
		return res.status(500).json({msg: "토큰 인증이 필요합니다."});
	
	if(res.locals.userData)
		return next();
		
	const userRow = await User.findUserByUid(res.locals.userUid);
	if(!userRow)
		return res.status(401).json({msg: "회원 인증에 실패했습니다."});
	
	res.locals.userData = {
		userUid: 	userRow._id,
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

		// 여기서 userUid db 검증해도됨.
		
		accessTokenManager.setToken(req, res, tokenData.userUid, tokenData.userRole);
	}

	res.locals.isLoggedIn 	= true;
	res.locals.userUid 		= tokenData.userUid;
	res.locals.userRole 	= tokenData.userRole;
	
	return next();
}

module.exports.permRequired = (requiredRoleText, doSetUserData)=> async (req, res, next)=> {
	const roleList = {"any":0, "user":1, "admin":9};

	if(!(requiredRoleText in roleList))
		return res.status(500).json({msg:'필요한 권한이 비정상적입니다.'});

	const requiredRole 	= roleList[requiredRoleText];
	const userRole 		= (res.locals.isLoggedIn && (res.locals.userRole in roleList)) ? roleList[res.locals.userRole] : 0;

	if(userRole < requiredRole){
		if(!res.locals.isLoggedIn)
			return res.status(401).json({msg:'로그인이 필요합니다.'});
		else
			return res.status(403).json({msg:'권한이 부족합니다.'});
	}

	if(doSetUserData)
		await setUserData(req, res);
	
	next();
}


// module.exports.verifyTokenMW = (requiredRoleList)=>{
// 	return (req, res, next)=>{
// 		if(!req.cookies.accessToken)
// 			return res.status(401).json({msg:"로그인이 필요합니다."});


// 		let tokenData = accessTokenManager.verifyToken(req.cookies.accessToken);
// 		if(!tokenData){
// 			let tokenData = refreshTokenManager.verifyToken(req.cookies.refreshToken);
// 			if(!tokenData)
// 				return res.status(401).json({msg:"비정상적이거나 만료된 토큰입니다."});

// 			// 여기서 userUid db 검증해도됨.
			
// 			accessTokenManager.setToken(req, res, tokenData.userUid);
// 		}

// 		if(!checkPerm(tokenData.userRole, requiredRoleList))
// 			return res.status(400).json({msg:"권한이 없습니다."});

// 		res.locals.userUid 		= tokenData.userUid;
// 		res.locals.userRole 	= tokenData.userRole;

// 		return next();
// 	}
// }