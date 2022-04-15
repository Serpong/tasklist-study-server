const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	userId:{type:String, required:true, unique:true},
	userPass:{type:String, required:true},
	userName:{type:String, required:true},
},{timestamps:true});

UserSchema.statics.findUserById = function(userId){
	return this.findOne({userId});
}

UserSchema.statics.findUserByIdPw = function(userId, userPass){
	return this.findOne({userId, userPass});
}

module.exports = mongoose.model("User", UserSchema);