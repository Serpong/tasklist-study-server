const User = require('../models/userModel')
const Photo = require('../models/photoModel');

const { body, check } = require('express-validator');
const { validate, idValidCheck } = require('../utils/validatorUtil');
const multer = require('multer');
const uploader = multer({ dest: process.env.PATH_UPLOADS, limits: { fileSize: 5 * 1024 * 1024 } });

const { permRequired } = require('../middlewares/authMiddleware');

module.exports = {
	insertPhoto:[
		permRequired("user", true),

		uploader.single('img'), // 이게 formdata -> req.body 생성해줌. 개꿀

		validate([
			body('photoSubject').notEmpty().withMessage("제목을 입력해주세요."),
		]),


		async (req, res, next)=>{
			
			let challenge_id = null;
			if(req.body.challenge_id){
				const challengeRow = await Challenge.findById(req.body.challenge_id);
				if(!challengeRow)
					return res.status(401).json({msg: "존재하지 않는 챌린지입니다."});
				challenge_id = challengeRow._id;
			}

			const inserted = await Photo.insertPhoto({
				photoSubject	: req.body.photoSubject,
				fileData		: req.file,
				user_id			: res.locals.user_id,
				challenge_id	: challenge_id,
			});
			
			if(inserted == null)
				return res.status(500).json({msg: "오류가 발생했습니다."});
			else
				return res.status(200).json({msg: "이미지가 성공적으로 등록되었습니다."});
		}
	],
	deletePhoto: [
		permRequired("user", true),

		idValidCheck,

		async (req, res)=>{
			const photoRow = await Photo.findOne({_id:req.params.id});
			if(photoRow == null)
				return res.status(200).json({ msg:"이미 삭제되었거나 존재하지 않는 사진입니다." });

			if(res.locals.userRole != 'admin' && photoRow.user != res.locals.user_id)
				return res.status(401).json({ msg:"삭제 권한이 없습니다." });
			
			try{
				await photoRow.delete();
				return res.status(200).json({ msg:"1개의 사진이 삭제되었습니다." });
			} catch(err) {
				return res.status(500).json({ msg:"사진 삭제에 오류가 발생했습니다." });
			}
		}
	]
};