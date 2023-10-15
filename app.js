const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const mysql = require('mysql');
const path = require('path');
var qs = require('querystring');

/*
 *
 * Cookie / Session
 * 
 */

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: oneDay 
  },
  resave: false // don't save session if unmodified, prevent duplicate
}));

/*
 *
 * Body Parser
 * 
 */

// const bodyParser = require('body-parser'); //body parse is used in older version of express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
 *
 * Routes
 * 
 */

/*
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const game1 = require('./public/game1');
app.use('/game1', game1.router);
*/

app.use(express.static(path.join(__dirname, '/')));
app.get('/', (req, res) => {
    //res.sendFile(path.join(__dirname, 'src', 'index.html'));
    res.sendFile(path.join(__dirname, 'index.html'));
  });

//app.use(express.static(__dirname));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


/*
 *
 * Database
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


/*
 *
 * Login, Logout
 * 
 */


app.post('/login', (req, res) => {

  const { email, password } = req.body;
  //console.log(req.body)
  const query = `SELECT * FROM user_profile WHERE email = '${email}' AND  password = '${password}'`;
  
  con.query(query, [email, password], (err, results) => { //the second attr is for to prevent SQL injection
      if (err) {
          console.error(err);
          return res.status(500).send('An error occurred.');
      }

      if (results.length > 0) {
          //console.log(c);
          console.log('Login success');
          var inv_array = null;
          if(results[0].inventory !== null) {

            inv_array = results[0].inventory.split(',');
            console.log(inv_array);         

          }

          req.session.user = {
            id: results[0].user_id,
            user: results[0].username,
            coin: results[0].coin,
            inv: inv_array
          }
          console.log(req.session.user);
          res.send(req.session.user);
      } else {
          console.log('Login failed');
          res.send('Login failed. Invalid username or password.');
      }
  });
  
});

app.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

app.post('/profile', (req, res) => {
  console.log("loadProfile Connected");
  if (req.session.user) {
    console.log('Profile loaded')
    console.log(req.session);
    const user = req.session.user;
    res.send(user);
  } else {
    console.log('Cannot load profile')
    res.send('User not logged in');
  }
});


/*
 *
 * Shop
 * 
 */


app.get('/loadShop', (req, res) => {
 
  console.log("loadShop Connected!");
  var sql_get_item = "SELECT * FROM item";

  con.query(sql_get_item, function (err, result, fields) {
    if (err) throw(err);
    else res.json(result);
  });
});


app.get('/buyItem', (req, res) => {
 
  
});


/*
 *
 * Load user inventory
 * 
 */


app.post('/loadInv', (req, res) => {

  console.log("loadInv Connected!");
  
  if (req.session.user) {

    let inv_array = req.session.user.inv;

    if(inv_array !== null) {

      var sql_get_item = `SELECT * FROM item WHERE item_id = `;

      for (let i = 0 ; i < inv_array.length ; i++) {

        if(inv_array.length == 1) {

          sql_get_item += `${inv_array[i]}`;

        } else {

          if(inv_array.length - i == 1) {

            sql_get_item += `${inv_array[i]}`;

          } else {

            sql_get_item += `${inv_array[i]} OR `;

          }

        }
      }

      console.log(sql_get_item);

      con.query(sql_get_item, function (err, result, fields) {
        console.log(result);
        if (err) throw(err);
        else res.send("inventory have item");
      });

    } else {
      
      res.send(`Inventory no item`);

    }

  } else {
    console.log('User not logged in')
    res.send('User not logged in');

  }

});


/*
 *
 * update coin
 * 
 */


app.post('/updateCoin', (req, res) => {

  console.log("updateCoin Connected!");
  let coin = req.body.coin;
  
  if (req.session.user) {
    
    let curCoin = req.session.user.coin;
    let newCoin = curCoin + coin;
    req.session.user.coin = newCoin;

    req.session.save((err) => {
      if (err) {
        res.status(500).send('Error updating session');
      } else {
        res.send('Coin updated successfully');
      }
    });

  } else {

    res.send('User not logged in');

  }

});