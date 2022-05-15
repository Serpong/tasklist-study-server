

// const errorFormatter = ({errorType, param, msg})=>{
// 	return { errorType, param, msg };
// }

module.exports.validationErrorFormatter = ({ location, msg, param, value, nestedErrors }) => {
	return {errorType:"validation", param, msg};//errorFormatter({errorType:"validation", param, msg});
};
module.exports.responseError = (res, error, statusCode)=>{
	return res.status(statusCode??400).json({error:error});
}