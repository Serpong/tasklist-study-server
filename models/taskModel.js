const mongoose = require('mongoose');

const File = require('./fileModel');
const Folder = require('./folderModel');

const TaskModel = new mongoose.Schema({
	content: {
		type:String,
		required:true,
	},
	folder: {
		type:mongoose.Schema.Types.ObjectId,
		ref:"Folder",
		required:true,
	},
},{timestamps:true});


TaskModel.statics.insertTask = async function({content, folder_id}){
	const inserted = new this({
		content		: content,
		folder		: folder_id,
	}).save();

	return inserted;
}


module.exports = mongoose.model("Task", TaskModel);