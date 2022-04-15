const mongoose = require('mongoose');
const User = require('./userModel')

//이미지파일 모델 따로 만들어야 할 듯
const PhotoSchema = new mongoose.Schema({
	photoSubject: {
		type:String,
		required:true,
	},
	fileName: {
		type:String,
		required:true,
	},
	originalName: {
		type:String,
		required:true,
	},
	user: {
		type:mongoose.Schema.Types.ObjectId,
		ref:"User",
		required:true,
	},
	challenge: {
		type:mongoose.Schema.Types.ObjectId,
		ref:"Challenge",
		required:false,
	},
},{timestamps:true});



PhotoSchema.statics.insertPhoto = function({photoSubject, fileName, originalName, user, challenge}){
	const inserted = new this( {photoSubject, fileName, originalName, user, challenge} ).save();
	return inserted;
}


module.exports = mongoose.model("Photo", PhotoSchema);