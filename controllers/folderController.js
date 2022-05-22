const { permRequired } = require("../middlewares/authMiddleware");
const { validate, idValidCheck } = require('../utils/validatorUtil');
const Task = require("../models/taskModel");
const Folder = require("../models/folderModel");
const { body } = require("express-validator");
const { responseError, responseSuccess } = require("../utils/responseUtil");
const multer = require("multer");
const uploader = multer({ dest: process.env.PATH_UPLOADS, limits: { fileSize: 5 * 1024 * 1024 } });

const selectColumn = ({_id, title, description, thumb}) =>
					 ({_id, title, description, thumb});

module.exports = {
	getFolder:[
		permRequired("user"),
		idValidCheck(),
		async (req,res)=>{
			const folderRow = await Folder.findOne({_id:req.params.id, user:res.locals.user_id});

			if(folderRow == null)
				return responseError(res, { msg:"존재하지 않는 폴더입니다."}, 404);

			let folders = {};
			folders[folderRow._id] = selectColumn(folderRow);

			return responseSuccess(res, { msg:"success", data:folders });
		}
	],
	listFolder:[
		permRequired("user"),
		async (req,res)=>{
			const folderRows = await Folder.find({user:res.locals.user_id});
			
			let folders = {};
			folderRows.forEach(function(folderRow) {
				folders[folderRow._id] = selectColumn(folderRow);
			});

			return responseSuccess(res, { msg:"success", data:folders });
		}
	],
	insertFolder:[
		permRequired("user"),

		uploader.single('thumb'), // 이게 formdata -> req.body 생성해줌. 개꿀
		
		validate([
			body('title')		.notEmpty().withMessage("title항목을 입력해주세요."),
			// body('description')	.notEmpty().withMessage("description항목을 입력해주세요."),
		]),

		async (req,res)=>{
			try{
				const newFolder = await Folder.insertFolder({
					title		: req.body.title,
					description	: req.body.description,
					fileData	: req.file,
					user_id		: res.locals.user_id,
				});
				return responseSuccess(res, { msg:"폴더가 추가되었습니다.", data: selectColumn(newFolder) });
				
			} catch(err) {
				return responseError(res, { msg:"폴더 추가에 오류가 발생했습니다." });
			}
		}
	],
	deleteFolder:[
		permRequired("user"),

		idValidCheck(),
		async (req,res)=>{
			try{
				const folderRow = await Folder.findOneAndDelete({_id:req.params.id, user:res.locals.user_id});
				if(folderRow != null)
					return responseSuccess(res, { msg:"1개의 폴더가 삭제되었습니다." });
				else
					return responseSuccess(res, { msg:"이미 삭제되었거나 존재하지 않는 폴더입니다." });
			} catch(err) {
				return responseError(res, { msg:"폴더 삭제에 오류가 발생했습니다." });
			}
		}
	]
};