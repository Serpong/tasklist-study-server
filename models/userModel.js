const mongoose = require('mongoose');

const userRoleList = ["user", "admin"];

const UserSchema = new mongoose.Schema({
	userId: 	{type:String, required:true, unique:true},
	userPass: 	{type:String, required:true},
	userName: 	{type:String, required:true},
	userRole: 	{type:String, required:true, enum:userRoleList, default:"user"},
},{timestamps:true});

UserSchema.statics.findUserById = function(userId){
	return this.findOne({userId});
}

UserSchema.statics.findUserByUid = function(userUid){
	return this.findOne({userUid});
}

UserSchema.statics.findUserByIdPw = function(userId, userPass){
	return this.findOne({userId, userPass});
}

module.exports = mongoose.model("User", UserSchema);