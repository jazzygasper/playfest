var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

var session = require('express-session');
var passport = require('passport');
var bodyParser = require('body-parser');

var sendToClientRoutes = require('./routes/sendToClient.js');
var userAuthentication = require('./routes/authentication.js');
var spotifyWebApi = require('./routes/spotifyPlaylist.js');
var ocr = require('./routes/ocr.js');
var passportSetup = require('./models/auth.js');

app.use(session({secret: "Jazzy is the cutest"}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passportSetup();

app.use('/', sendToClientRoutes);
app.use('/auth', userAuthentication);
app.use('/spotifyPlaylist', spotifyWebApi);
app.use('/poster', ocr);

app.listen(port, function(){
  console.log('Your Playfest Backend is running on port ' + port);
});

module.exports = app;
