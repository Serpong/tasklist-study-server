const { permRequired } = require("../middlewares/authMiddleware");
const { validate, idValidCheck } = require('../utils/validatorUtil');
const Challenge = require("../models/challengeModel");
const { body } = require("express-validator");

const selectColumn = ({subject,description,startTime,endTime}) =>
					 ({subject,description,startTime,endTime});

module.exports = {
	getChallenge:[
		idValidCheck(),
		async (req,res)=>{
			const challengeRow = await Challenge.findOne({_id:req.params.id});

			if(challengeRow == null)
				return res.status(404).json({ msg:"존재하지 않는 챌린지입니다."});

			let challenges = {};
			challenges[challengeRow._id] = selectColumn(challengeRow);

			return res.status(200).json({ msg:"success", data:challenges });
		}
	],
	listChallenge:[
		async (req,res)=>{
			const challengeRows = await Challenge.find({});
			
			let challenges = {};
			challengeRows.forEach(function(challengeRow) {
				challenges[challengeRow._id] = selectColumn(challengeRow);
			});

			return res.status(200).json({ msg:"success", data:challenges });
		}
	],
	insertChallenge:[
		permRequired("admin"),
		
		validate([
			body('subject')		.notEmpty()		.withMessage("subject항목을 입력해주세요."),
			body('description')	.notEmpty()		.withMessage("description항목을 입력해주세요."),
			body('startTime')	.notEmpty()		.withMessage("startTime항목을 입력해주세요."),
			body('startTime')	.isISO8601()	.withMessage("비정상적인 date형식입니다. (startTime)"),
			body('endTime')		.notEmpty()		.withMessage("endTime항목을 입력해주세요."),
			body('endTime')		.isISO8601()	.withMessage("비정상적인 date형식입니다. (endTime)"),
		]),

		async (req,res)=>{
			const newChallenge = new Challenge({
				subject		: req.body.subject,
				description	: req.body.description,
				startTime	: req.body.startTime,
				endTime		: req.body.endTime,
			});
			
			try{
				await newChallenge.save();
			} catch(err) {
				return res.status(400).json({ msg:"챌린지 등록에 오류가 발생했습니다." });
			}
			return res.status(200).json({ msg:"챌린지 등록이 완료되었습니다" });
		}
	],
	deleteChallenge:[
		permRequired("admin"),

		idValidCheck(),
		async (req,res)=>{
			try{
				const challengeRow = await Challenge.findOneAndDelete({_id:req.params.id});
				if(challengeRow != null)
					return res.status(200).json({ msg:"1개의 챌린지가 삭제되었습니다." });
				else
					return res.status(200).json({ msg:"이미 삭제되었거나 존재하지 않는 챌린지입니다." });
			} catch(err) {
				return res.status(400).json({ msg:"챌린지 삭제에 오류가 발생했습니다." });
			}
		}
	]
};