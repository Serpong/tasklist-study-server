const File = require('../models/fileModel');
const { idValidCheck } = require('../utils/validatorUtil');

module.exports = {
	showImage:[
		idValidCheck,
		async (req, res, next)=>{
			
			const fileRow = await File.findOne({_id:req.params.id});
			
			if(fileRow == null)
				return res.status(404).json({msg: "존재하지 않는 이미지입니다."});

			return res
				.set("Content-Type", "image/jpeg")
				.sendFile(process.env.PATH_UPLOADS + fileRow.fileName, {root:req.app.get('appPath')});
		}
	],
};