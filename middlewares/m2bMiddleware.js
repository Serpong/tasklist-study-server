// const multiparty = require('multiparty');


// module.exports.m2bMiddleware = (req, res, next)=>{
// 	var form = new multiparty.Form();
// 	form.parse(req, function(err, body, files) {
// 		if (err)
// 			return res.status(500).end();

// 		// req.body = body;
// 		console.log(2, req.body);
// 		req.body.photoSubject = "fdfsd";
// 		console.log(3, req.body);
// 		next(); //여기서 하면 1개만 되나? 아래로 한 칸 내려야하나?
// 	});
// };