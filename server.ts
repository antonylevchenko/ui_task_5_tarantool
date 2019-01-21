const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const Tarantool = require('tarantool-driver');
const cr = require('crypto');
const cookie = require('cookie-parser');

const jsonParser = express.json();

const tarantoolTokensSpaceId = 'tokens';

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(cookie());

const mySqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pass',
  database: 'ui_task_5_db'
});

const tarantoolConnection = new Tarantool({
  host: 'localhost',
  port: '3301'
});

mySqlConnection.connect();


app.listen(5000, function() {
  console.log('Server is listening.');
});

app.post('/api/authentication/create-user', function(req, res) {
  console.log(req.body);
  const user = req.body;
  console.log(user);
  const userName = user.name;
  let userPassword = user.password;
  userPassword = cr.createHash('md5').update(userPassword).digest('hex');
  const query = 'INSERT INTO users (name, password) VALUES (?, ?)';
  mySqlConnection.query(query, [userName, userPassword], function(error, results, fields) {
    if (error) {throw (error) ; }
  });
  res.send({res: 'Ok'});
});

app.post('/api/authentication/login', function (req, res) {
  const user = req.body;
  const userName = user.name;
  let userPassword = user.password;
  userPassword = cr.createHash('md5').update(userPassword).digest('hex');
  const query = 'SELECT name, password FROM users WHERE name = ?';
  mySqlConnection.query(query, [userName], async function(err, result, fields) {
    if (err) {throw err; }
    const resultUser = result[0];
    const resPassword = resultUser.password;
    const resName = resultUser.name;
    if (resPassword === userPassword) {

      const token = createToken(resName, userPassword);

      console.log(token);
      tarantoolConnection.upsert(tarantoolTokensSpaceId, [], [token]);

      res.cookie('token', token, {maxAge: 3600000});
      res.cookie('name', resName, {maxAge: 360000});
      res.send({loggedIn: true, name: userName});
    } else {
      res.send({loggedIn: false});
    }

  });
});

app.get('/api/authentication/check-if-logged', function (req, res) {
  let loggedIn = false;
  const token = req.cookies.token;
  console.log(req.cookies);
  const name = req.cookies.name;
  console.log(token);
  if (token != null) {
      tarantoolConnection.select(512, 0, 1, 0, 'eq', token)
    .then(function(results) {
      if (results[0][0]) {
        loggedIn = true;
        res.send({
          loggedIn: loggedIn,
          name: name});
      } else {
        res.send({
          loggedIn: false
        });
      }
    });
  } else {
    res.send({loggedIn: false});
  }
});

app.get('/api/authentication/logout', function(req, res) {
  res.clearCookie('token');
  res.send({cleared: true});
});

function createToken(name, password) {
  let res = name + password;
  res = cr.createHash('md5').update(res).digest('hex');
  return(res);
}
