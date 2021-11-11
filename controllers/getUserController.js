const jwt = require('jsonwebtoken');
const conn =  require('../dbconnection').promise();


exports.getUser = async(req,res,next)=>{
    try {
        if(!req.headers.authorization)
        {
            return res.status(400).json({message : "Please Provide the token"});
        }

        const theToken = req.headers.authorization;
        const decoded = jwt.verify(theToken,'the-super-strong-secrect');

        const [row] = await conn.execute("SELECT `id`,`name`,`email`,`password` FROM `users` WHERE `id`=?",[decoded.id]);

        if(row.length>0){
            return res.status(200).json({User : row[0]});
        }
  else {
      res.status(400).json({message : "No User Found"});
  }
    }
    catch(err)
    {
        next(err);
    }
}