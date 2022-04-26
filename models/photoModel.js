const mongoose = require('mongoose');

const File = require('./fileModel')

const PhotoSchema = new mongoose.Schema({
	description: {
		type:String,
		// required:true,
	},
	file: {
		type:mongoose.Schema.Types.ObjectId,
		ref:"File",
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

PhotoSchema.statics.getWhitelist = function(){
	return ["description", "file", "user", "challenge"];
}



PhotoSchema.statics.insertPhoto = async function({description, fileData, user_id, challenge_id}){
	const fileRow = await File.insertFile({fileData, user_id});
	if(fileRow == null)
		return null;

	const inserted = new this({
		description,
		file		: fileRow._id,
		user		: user_id,
		challenge	: challenge_id,
	}).save();

	return inserted;
}


module.exports = mongoose.model("Photo", PhotoSchema);