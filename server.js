const express = require("express");
const app = express();
const path = require('path');
const exjwt = require('express-jwt');
const jwt = require("jsonwebtoken");
const PORT = 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
});

const bodyParser = require('body-parser');
const secretKey = 'My super secret key';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const jwtMW = exjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let users = [
  {
    id: 1,
    username: "sharmila",
    password: "123",
  },

  {
    id: 2,
    username: "donbosco",
    password: "456",
  },
];
// app.post("/apo/login", (req, res) => {
//   const { username, password } = req.body;
// });

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log("/api/login :")
  for (let user of users) {
    if (username == user.username && password == user.password) {
      let token = jwt.sign(
        { id: user.id, username: user.username },
        secretKey,
        { expiresIn: 180 }
      );
      res.json({
        success: true,
        err: null,
        token,
      });
      break;
    }
  }
  res.status(400).json({
    success: false,
    token: null,
    err: "Username or password is incorrect",
  });


});

app.use('/src', express.static(__dirname + '/src'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/src/index.html'));
});

app.get('/dashboardPage', (req, res) => {
  res.sendFile(path.join(__dirname+'/src/Dashboard/dashboard.html'));
});

app.get('/api/dashboard', jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: 'Secret content that only logged in people can see!!!',
  });
});

app.get('/settingPage', (req, res) => {
  res.sendFile(path.join(__dirname+'/src/Dashboard/settings.html'));
});

app.get('/api/settings', jwtMW, (req, res) => {
  res.json({
    success: true,
    myContent: 'Secret content that only logged in people can see!!!',
  });
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      success: false,
      officialError: err,
      err: 'Username or Password is incorrect',
    });
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
});

