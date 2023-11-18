
const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "mw",
    password: "chanmingwai",
    database: "pm_game"
  });
  
  //Connect to db
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to db!");
  });
  
module.exports = {
    con
}