

// const errorFormatter = ({errorType, param, msg})=>{
// 	return { errorType, param, msg };
// }

module.exports.validationErrorFormatter = ({ location, msg, param, value, nestedErrors }) => {
	return {errorType:"validation", param, msg};//errorFormatter({errorType:"validation", param, msg});
};
module.exports.responseSuccess = (res, data, statusCode)=>{
	return res.status(statusCode??200).json(data);
};
module.exports.responseError = (res, error, statusCode)=>{
	return res.status(statusCode??400).json({error:error});
};