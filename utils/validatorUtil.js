const { validationResult } = require('express-validator');

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

		res.status(400).json({ errors: errors.formatWith(errorFormatter).array() });
	};
};