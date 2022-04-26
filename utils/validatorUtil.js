const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
	return { errorType:"validation", param, msg }
};


module.exports.validate = (validations) => {
	return async (req, res, next) => {
		for (let validation of validations) {
			const result = await validation.run(req);
			if (result.errors.length) break;
		}

		const errors = validationResult(req);
		if (errors.isEmpty())
			return next();

		return res.status(400).json({ errors: errors.formatWith(errorFormatter).array() });
	};
};

module.exports.idValidCheck = (req, res, next) => {
	if(req.params.id && mongoose.isValidObjectId(req.params.id))
		return next();

	return res.status(400).json({msg:"비정상적인 id값입니다."});
};

module.exports.getFields = (fields) => {
	if(!fields) return [];

	return fields.split(',').map((data)=>{
		return data.trim();
	});
};


module.exports.selectColumn = (row, selectlist, whitelist) => {
	let filteredRow = {};
	for (let i = 0; i < whitelist.length; i++) {
		if(!selectlist.includes(whitelist[i])) continue;
		filteredRow[whitelist[i]] = row[whitelist[i]]??null;
	}
	return filteredRow;
};


// module.exports.idValidCheck = (req, res, next) => {
	
// 	if(!req.params.id)
// 		return next();
	
// 	if(mongoose.isValidObjectId(req.params.id)){
// 		res.locals.param_id = req.params.id;
// 		return next();
// 	}

// 	return res.status(400).json({msg:"비정상적인 id값입니다."});
// };