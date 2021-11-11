const router =require("express").Router();
const {body}= require("express-validator");
const {register} = require("./controllers/registerController");
const {login} = require("./controllers/loginController");
const {getUser} = require("./controllers/getUserController");
const {validationResult} = require('express-validator');
const conn = require('./dbconnection').promise();
const bcrypt = require('bcryptjs');

router.post("/register",[
    body('name',"The name must be of minimus3 characters").notEmpty().isLength({min:3}),
    body('email',"Invalid Email Address").notEmpty().isEmail(),
    body('password',"Password must be of minimum 5 charaters").notEmpty().isLength({min:5}),
],async(req,res,next)=>{
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
    });


router.post("/login",[
    body('email',"Invalid Email Address").notEmpty().isEmail(),
    body('password',"Invalid Password").notEmpty().isLength({min:5}),
],login);

router.get("/getUser",getUser);
router.get("/getUser/:id",async(req,res,next)=>{
    try {
        if(!req.params.id)
        {
            return res.status(400).json({message : "Please Provide the id"});
        }

      
        

        const [row] = await conn.execute("SELECT `id`,`name`,`email`,`password` FROM `users` WHERE `id`=?",[req.params.id]);

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
});

module.exports = router;