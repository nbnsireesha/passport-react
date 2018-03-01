
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const dbConnection = require('./db'); // loads our connection to the mongo database
const passport = require('./passport');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const PORT = process.env.PORT || 3001;
// const routes = require('./auth');

// Configure body parser for AJAX requests
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Serve up static assets (usually on heroku)
app.use(express.static("../client/public"));
// Add routes, both API and view
app.use('/auth', require('./auth'));
app.use(
	session({
		secret: process.env.APP_SECRET || 'this is the default one',
		store: new MongoStore({ mongooseConnection: dbConnection }),
		resave: false,
		saveUninitialized: false
	})
);

// ===== Passport ====
app.use(passport.initialize());
app.use(passport.session());// will call the deserializeUser

// Set up promises with mongoose
// mongoose.Promise = global.Promise;
// // Connect to the Mongo DB
// mongoose.connect(
//   process.env.MONGODB_URI || "mongodb://localhost/quizardofahhhs",
//   {
//     useMongoClient: true
//   }
// );

// ====== Error handler ====
app.use(function(err, req, res, next) {
	console.log('====== ERROR =======');
	console.error(err.stack);
	res.status(500);
})

app.listen(PORT, function() {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
