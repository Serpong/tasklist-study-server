const { permRequired } = require('../middlewares/authMiddleware');

module.exports.devMain = [
	permRequired("user", true),

	(req, res) =>{
		res.status(200).json({msg:res.locals.userData.userName + "상 로그인 됐네 ㅊㅋ"})
	}
]