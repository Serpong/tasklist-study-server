const User = require('../models/userModel')
const Photo = require('../models/photoModel');

const { body, check } = require('express-validator');
const { validate } = require('../utils/validatorUtil');
const multer = require('multer');
const uploader = multer({ dest: process.env.PATH_UPLOADS, limits: { fileSize: 5 * 1024 * 1024 } });

const { verifyTokenMiddleware } = require('../middlewares/authMiddleware');
// const { m2bMiddleware } = require('../middlewares/m2bMiddleware');

module.exports.insertPhoto = [
	verifyTokenMiddleware,

	uploader.single('img'), // 이게 formdata -> req.body 생성해줌. 개꿀

	validate([
		body('photoSubject').notEmpty().withMessage("제목을 입력해주세요."),
	]),


	async (req, res, next)=>{
		const userRow = await User.findUserById(res.locals.userId);

		const inserted = await Photo.insertPhoto({
			photoSubject	: "test",
			fileName		: req.file.filename,
			originalName	: req.file.originalname,
			user			: userRow._id             //_id 붙이나 안붙이나 똑같음.
		});

		return res.status(200).send('testing');
	}
];