const mysql = require("mysql2");

const db_connection = mysql.createConnection({
    host : "localhost",
    user :"root",
    password : "",
    database : "register_api",
})
.on("error",(err)=>{
 console.log("Failed to Connect to database - ", err);
});
console.log("connected");

module.exports = db_connection;