var mysql = require('mysql');
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring')
//var db = require('./db.js');

const host = 'localhost'; // The ip of your device hosting server, else localhost
const port = 8080;
const requestListener = function (req, res) {
  
  if (req.method == 'POST') {
    var body = '';

    req.on('data', function (data) {
        body += data;
        console.log(qs.parse(body));
        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            req.connection.destroy();
    });

    req.on('end', function () {
        var POST = qs.parse(body);
        // console.log(JSON.stringify(POST));
        // use POST['blah'], etc.
        // res.end(JSON.stringify(post));
        if(POST["action"] == "login") {
          login(POST)
          .then((result) => {
            console.log("login returned" + JSON.stringify(result));
            res.end("con 9 firm");
          });

        } else if(POST["action"] == "loadshop") {

          loadShop()
          .then((result) => {
            console.log("loadShop returned" + JSON.stringify(result));
            res.end(JSON.stringify(result)); //Stringify and send response
          });
        } else if(POST["action"] == "minigame") {
          console.log("minigamehello")
          if(POST["minigame"] == "1"){
            //res.writeHead(302, {'Location': '/Minigames/minigame1.html'}); //status code 302 = redirect
            console.log("minigamehello2")


            res.end('<script>window.location.href="/Minigames/minigame1.html";</script>');
          }
        }
    });
  } else {

    var filename = "." + url.parse(req.url, true).pathname;
    //console.log(req.url);
    console.log(filename);
    //fs.readFile(__dirname + "/index.html", (err, contents)=> {
    fs.readFile(filename, (err, contents)=> {
  
      if(filename == './') {
        res.writeHead(302, {'Location': '/index.html'}); //status code 302 = redirect
        res.end();
      } else if(err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end(`404 Not Found \n ${err}`);
      } else {
        //res.setHeader("Content-Type", "text/html");
        res.writeHead(200, {"Content-Type": "text/html"});  //status code, 200 = ok
        res.end(contents);
      }
    });
    
    //res.setHeader("Content-Type", "application/json");
    //res.setHeader("Content-Type", "text/csv");
    //res.setHeader("Content-Disposition", "attachment;filename=oceanpals.csv"); how to display the data

  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});

server.on('connection', (stream) => {
  console.log('someone connected!');
});

/*
 *
 *
 * 
 * DATABASE ******************************************************************
 * 
 * 
 * 
 */


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pm_game"
});

//Connect to db
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to db!");
});

function login(POST) {
    console.log("Login Connected!");
    var sql_get_user = "SELECT * FROM user_profile";

    let item = new Promise(function (resolve, reject) {
      con.query(sql_get_user, function (err, result, fields) {
        if (err) reject(err);
        else resolve(result);
        console.log("result1" + result);
      });
    });

    if(true) {

    }

    console.log("result2" + item);
    return item;

}

function loadShop () {
  
  console.log("loadShop Connected!");
  var sql_get_item = "SELECT * FROM item";
  let item = new Promise(function (resolve, reject) {
    con.query(sql_get_item, function (err, result, fields) {
      // if (err) throw (err);
      if (err) reject(err);
      else resolve(result);
    });
  });
  //console.log("result2" + item);
  return item;
}


/*
http.createServer(function (req, res) {
  
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(8080);
*/