module.exports = (router) => {

	// /auth
	const authController = require('./controllers/authController');
	router.get("/auth/login-check",				...authController.loginCheck);
	router.post("/auth/user-login",				...authController.userLogin);
	router.post("/auth/user-register",			...authController.userRegister);
	router.post("/auth/user-logout",			...authController.userLogout);

	// /folders
	const folderController = require('./controllers/folderController');
	router.get('/folder',						...folderController.listFolder);
	router.get('/folder/:id',					...folderController.getFolder);
	router.post('/folder',						...folderController.insertFolder);
	router.delete('/folder/:id',				...folderController.deleteFolder);
	
	// /tasks
	const taskController = require('./controllers/taskController');
	router.get('/task',							...taskController.listTask);
	router.get('/task/:id',						...taskController.getTask);
	router.post('/task',						...taskController.insertTask);
	router.post('/task/:id',					...taskController.editTask);
	router.delete('/task/:id',					...taskController.deleteTask);
	router.get('/task/findByFolder/:id',		...taskController.listTaskByFolder);

	// /file
	const fileController = require('./controllers/fileController');
	router.get('/image/:id',					...fileController.showImage);

	return router;
}