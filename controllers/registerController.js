const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbconnection');


exports.register = async(req,res,next)=>{
const errors = validationResult(req);
if(!errors.isEmpty())
{
        return res.status(422).json({errors: errors.array()});
}
try{
  const [row] = await conn.execute("SELECT `email` FROM `users` WHERE `email`=?",[req.body.email]);
  if(row.length > 0) {
      return res.status(201).json({message: "The E-mail already in use"});
  }

  const hashPaas = await bcrypt.hash(req.body.password, 12);
  const [rows] = await conn.execute('INSERT INTO `users`(`name`,`email`,`password`)VALUES(?,?,?)',[
      req.body.name,
      req.body.email,
      hashPaas
  ]);

  if(rows.affectedRows === 1)
  {
      return res.status(200).json({message : "The User has been Successfully Registered"});
  }
}
catch(err){
    next(err);
}
}