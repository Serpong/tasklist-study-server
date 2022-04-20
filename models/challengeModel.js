const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
	subject 	: {type:String, required:true},
	description : {type:String, required:true},
	startTime 	: {type:Date, 	required:false},
	endTime 	: {type:Date, 	required:false},
},{timestamps:true});


ChallengeSchema.statics.findById = function(challengeId){
	return this.findOne({_id:challengeId});
}

module.exports = mongoose.model("Challenge", ChallengeSchema);