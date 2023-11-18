const express = require('express');
const cookieParser = require("cookie-parser"); 
const sessions = require("express-session");
const path = require('path');
const qs = require('querystring');

const app = express();

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
app.set('trust proxy', 1);

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


//const game1 = require('./public/game1');
//app.use('/game1', game1.router);


app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req, res) => {
    //res.sendFile(path.join(__dirname, 'src', 'index.html'));
    res.sendFile(path.join(__dirname, 'index.html'));
  });

const port = process.env.PORT || 3000;
const expressServer = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

require('./controller')(app);

