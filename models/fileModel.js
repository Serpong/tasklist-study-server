const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
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
},{timestamps:true});



FileSchema.statics.insertFile = function({fileData, user_id}){
	if(!fileData || fileData.filename == null || fileData.originalname == null)
		return null;

	const inserted = new this({
		fileName		: fileData.filename,
		originalName	: fileData.originalname,
		user			: user_id,
	}).save();

	return inserted;
}


module.exports = mongoose.model("File", FileSchema);