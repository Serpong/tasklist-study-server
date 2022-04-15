module.exports = (router) => {
	
	// root tmp
	const { verifyTokenMiddleware } = require('./middlewares/authMiddleware');
	router.get('/', verifyTokenMiddleware, (req, res) => res.status(400).json({msg:"what do you want"}) );

	// /auth
	const authController = require('./controllers/authController');
	router.post("/auth/user-login", ...authController.userLogin);
	router.post("/auth/user-register", ...authController.userRegister);
	router.post("/auth/user-logout", ...authController.userLogout);

	// /challenges
	const photoController = require('./controllers/photoController');
	router.post('/photo', photoController.insertPhoto);

	// /challenges
	const challengeController = require('./controllers/challengeController');
	//router.get('/challenges', challengeController.listChallenges)


	return router;
}