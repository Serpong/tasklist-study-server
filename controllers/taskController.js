const { permRequired } = require("../middlewares/authMiddleware");
const { validate, idValidCheck } = require('../utils/validatorUtil');
const Task = require("../models/taskModel");
const { body } = require("express-validator");
const { responseError, responseSuccess } = require("../utils/responseUtil");
const Folder = require("../models/folderModel");

const selectColumn = ({_id, content,}) =>
					 ({_id, content,});

module.exports = {
	getTask:[
		permRequired("user"),
		idValidCheck(),
		async (req,res)=>{
			const taskRow = await Task.findOne({_id:req.params.id, user:res.locals.user_id});

			if(taskRow == null)
				return responseError(res, { msg:"존재하지 않는 태스크입니다."}, 404);

			let tasks = {};
			tasks[taskRow._id] = selectColumn(taskRow);

			return responseSuccess(res, { msg:"success", data:tasks });
		}
	],
	listTask:[
		permRequired("user"),
		async (req,res)=>{
			const taskRows = await Task.find({user:res.locals.user_id});
			
			let tasks = {};
			taskRows.forEach(function(taskRow) {
				tasks[taskRow._id] = selectColumn(taskRow);
			});

			return responseSuccess(res, { msg:"success", data:tasks });
		}
	],
	listTasksByFolder:[
		permRequired("user"),
		async (req,res)=>{
			const folderRow = await Folder.findOne({_id:req.params.id, user:res.locals.user_id});

			if(folderRow == null)
				return responseError(res, { msg:"존재하지 않는 폴더입니다."}, 404);
				
			const taskRows = await Task.find({user:res.locals.user_id, folder:req.params.id});
			
			let tasks = {};
			taskRows.forEach(function(taskRow) {
				tasks[taskRow._id] = selectColumn(taskRow);
			});

			return responseSuccess(res, { msg:"success", data:tasks });
		}
	],
	insertTask:[
		permRequired("user"),

		idValidCheck('folder_id'),

		validate([
			body('content').notEmpty().withMessage("content항목을 입력해주세요."),
		]),

		async (req,res)=>{
			const folderRow = await Folder.findOne({_id:req.body.folder_id, user:res.locals.user_id,});
			if(!folderRow)
				return responseError(res, { msg:"존재하지 않는 폴더입니다."});

			try{
				const taskRow = await Task.insertTask({
					content		: req.body.content,
					folder_id	: req.body.folder_id,
				});

				return responseSuccess(res, { msg:"태스크가 추가되었습니다.", data:selectColumn(taskRow) });
			} catch(err) {
				return responseError(res, { msg:"태스크 추가에 오류가 발생했습니다." });
			}
		}
	],
	deleteTask:[
		permRequired("user"),
		idValidCheck(),
		async (req,res)=>{
			try{
				const taskRow = await Task.findOneAndDelete({_id:req.params.id, user:res.locals.user_id});
				if(taskRow != null)
					return responseSuccess(res, { msg:"1개의 태스크가 삭제되었습니다." });
				else
					return responseSuccess(res, { msg:"이미 삭제되었거나 존재하지 않는 태스크입니다." });
			} catch(err) {
				return responseError(res, { msg:"태스크 삭제에 오류가 발생했습니다." });
			}
		}
	]
};