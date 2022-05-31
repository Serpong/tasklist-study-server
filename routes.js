module.exports = (router) => {

	// /auth
	const authController = require('./controllers/authController');
	router.get("/auth/login-check",				...authController.loginCheck);
	router.post("/auth/user-login",				...authController.userLogin);
	router.post("/auth/user-register",			...authController.userRegister);
	router.post("/auth/user-logout",			...authController.userLogout);

	// /folders
	const folderController = require('./controllers/folderController');
	router.get('/folders',						...folderController.listFolder);
	router.get('/folders/:id',					...folderController.getFolder);
	router.post('/folders',						...folderController.insertFolder);
	router.delete('/folders/:id',				...folderController.deleteFolder);
	
	// /tasks
	const taskController = require('./controllers/taskController');
	router.get('/tasks',						...taskController.listTask);
	router.get('/tasks/:id',					...taskController.getTask);
	router.post('/tasks',						...taskController.insertTask);
	router.post('/tasks/:id',					...taskController.editTask);
	router.delete('/tasks/:id',					...taskController.deleteTask);
	router.get('/tasks/findByFolder/:id',		...taskController.listTaskByFolder);

	// /file
	const fileController = require('./controllers/fileController');
	router.get('/images/:id',					...fileController.showImage);

	return router;
}