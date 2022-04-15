const { permRequired } = require('../middlewares/authMiddleware');

module.exports.devMain = [
	permRequired("admin", true),

	(req, res) =>{
		res.status(200).json({msg:res.locals.userData.userName + "상 로그인됐네 ㅊㅋ"})
	}
]