const jwt = require('jsonwebtoken');
const bcrypt =require('bcryptjs');
const {validationResult} = require('express-validator');
const conn =  require('../dbconnection').promise();

exports.login = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
       return res.status(422).json({errors : errors.array()});
    }
    try{
        const [row] = await conn.execute("SELECT * FROM `users` WHERE `email`=?",[req.body.email]);

        if(row.length ===0)
        {
            return res.status(422).json({message : "Invalid Email "});
        }

        const passMatch = await bcrypt.compare(req.body.password,row[0].password);
        if(!passMatch){
            return res.status(422).json({message:"Invalid Password"});
        }
        const theToken = jwt.sign({id:row[0].id},'the-super-strong-secrect',{ expiresIn: '5h' });

        return res.json({
            token:theToken,
            message : "User Login Suceessfully ",
            details : row[0]
           
        });

    }
    catch(err){
        next(err);
    }
}