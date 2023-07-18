var mysql = require('mysql');
var http = require('http');
var url = require('url');
var fs = require('fs');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pm_game"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  var sql_get_item = "SELECT * FROM item_profile";
  con.query(sql_get_item, function (err, result, fields) {
    if (err) throw err;
    var items = result;
    console.log(items);
  });
});

function login() {
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    var sql_get_user = "SELECT * FROM user_profile";
    con.query(sql_get_user, function (err, result, fields) {
      if (err) throw err;
      var items = result;
      console.log(items);
    });
  });
}