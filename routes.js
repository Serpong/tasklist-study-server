module.exports = (router) => {
	
	// for dev
	const devController = require('./controllers/devController');
	router.get('/',	...devController.devMain);

	// /auth
	const authController = require('./controllers/authController');
	router.post("/auth/user-login",		...authController.userLogin);
	router.post("/auth/user-register",	...authController.userRegister);
	router.post("/auth/user-logout",	...authController.userLogout);

	// /photos
	const photoController = require('./controllers/photoController');
	router.post('/photo',	...photoController.insertPhoto);
	router.delete('/photo',	...photoController.deletePhoto);

	// /challenges
	const challengeController = require('./controllers/challengeController');
	router.get('/challenge',				...challengeController.listChallenge);
	router.get('/challenge/:challenge_id',	...challengeController.getChallenge);
	router.post('/challenge',				...challengeController.insertChallenge);
	router.delete('/challenge',				...challengeController.deleteChallenge);


	return router;
}