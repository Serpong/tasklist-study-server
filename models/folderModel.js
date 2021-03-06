const mongoose = require('mongoose');

const File = require('./fileModel')

const FolderModel = new mongoose.Schema({
	title: {
		type:String,
		required:true,
	},
	description: {
		type:String,
		required:false,
	},
	thumb: {
		type:mongoose.Schema.Types.ObjectId,
		ref:"File",
		required:false,
	},
	user: {
		type:mongoose.Schema.Types.ObjectId,
		ref:"User",
		required:true,
	},
},{timestamps:true});


FolderModel.statics.insertFolder = async function({title, description, fileData, user_id}){
	const fileRow = await File.insertFile({fileData, user_id});

	let file_id = null;
	if(fileRow != null)
		file_id = fileRow._id;

	const inserted = new this({
		title		: title,
		description	: description,
		thumb		: file_id,
		user		: user_id,
	}).save();

	return inserted;
}

FolderModel.statics.format = function(folderRow){
	let result = {
		_id			: folderRow._id,
		title		: folderRow.title,
		description	: folderRow.description,
		thumbUrl	: process.env.URL_IMAGES+folderRow.thumb,
		// user		: folderRow.user,
	};

	return result;
}


module.exports = mongoose.model("Folder", FolderModel);