const User = require('../models/userModel');

const { body } = require('express-validator');
const { validate } = require('../utils/validatorUtil');
const { TokenManager } = require('../utils/authUtil');
const { responseError, responseSuccess } = require('../utils/responseUtil');

const accessTokenManager = TokenManager("accessToken");
const refreshTokenManager = TokenManager("refreshToken");



module.exports.loginCheck = [
	async (req, res, next)=>{
		return res.status(200).json({ data:{isLoggedIn:res.locals.isLoggedIn}, msg: "데이터를 성공적으로 불러왔습니다." });
	}
];


module.exports.userLogin = [
	validate([
		body('userId').notEmpty().withMessage("아이디를 입력해주세요."),
		body('userPass').notEmpty().withMessage("패스워드를 입력해주세요."),
	]),
	async (req, res, next)=>{
		const userRow = await User.findUserByIdPw(req.body.userId, req.body.userPass);
		if(!userRow)
			return responseError(res, {errorType:"invalidData", msg: "아이디나 패스워드가 틀렸습니다."});
		
		accessTokenManager.setToken(req, res, userRow._id, userRow.userRole);
		refreshTokenManager.setToken(req, res, userRow._id, userRow.userRole);
		
		return res.status(200).json({ msg: "로그인이 완료되었습니다." });
	}
];

module.exports.userRegister = [
	validate([
		body('userId').notEmpty().withMessage("아이디를 입력해주세요."),
		body('userPass').isLength({min:6}).withMessage("패스워드는 최소 6글자입니다."),
		body('userName').notEmpty().withMessage("성함을 입력해주세요."),
	]),
	async (req,res)=>{
		const userRow = await User.findUserById(req.body.userId);
		if(userRow != null) return res.status(409).json({msg: "이미 존재하는 ID입니다."});

		const newUser = new User({
			userId:req.body.userId,
			userPass:req.body.userPass,
			userName:req.body.userName,
			userRole:'user',
		});
		try{
			await newUser.save();
		} catch(err) {
			return res.status(400).json({ msg:"회원가입에 오류가 발생했습니다." })//, err:err.message
		}
		return res.status(200).json({ msg:"회원가입이 완료되었습니다" });
	}
];

module.exports.userLogout = [
	(req,res)=>{
		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');
		return responseSuccess(res, {msg:"로그아웃 되었습니다."});
	}
];