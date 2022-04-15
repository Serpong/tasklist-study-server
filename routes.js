module.exports = (router) => {
	
	// for dev
	const devController = require('./controllers/devController');
	router.get('/', ...devController.devMain);

	// /auth
	const authController = require('./controllers/authController');
	router.post("/auth/user-login", ...authController.userLogin);
	router.post("/auth/user-register", ...authController.userRegister);
	router.post("/auth/user-logout", ...authController.userLogout);

	// /photos
	const photoController = require('./controllers/photoController');
	router.post('/photo', photoController.insertPhoto);

	// /challenges
	const challengeController = require('./controllers/challengeController');
	//router.get('/challenges', challengeController.listChallenges)


	return router;
}