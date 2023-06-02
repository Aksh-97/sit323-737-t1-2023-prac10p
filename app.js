// App.js

var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose =
		require("passport-local-mongoose")
const User = require("./model/User");
var app = express();

mongoose.connect("mongodb://admin:iamuser@localhost:32000/?authMechanism=DEFAULT");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
	,
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=====================
// ROUTES
//=====================

// homepage route
app.get("/", function (req, res) {
	res.render("home");
});

//secret page
app.get("/secret", isLoggedIn, function (req, res) {
	res.render("secret");
});

// registration form
app.get("/register", function (req, res) {
	res.render("register");
});

// registration func
app.post("/register", async (req, res) => {
	const usercreate = await User.create({
	username: req.body.username,
	password: req.body.password
	});
	
	return res.status(200).json(usercreate);
});

//Sign in form
app.get("/login", function (req, res) {
	res.render("login");
});

//signin func
app.post("/login", async function(req, res){
	try {
		// does user exist
		const isUser = await User.findOne({ username: req.body.username });
		if (isUser) {
		//check if password matches
		const result = req.body.password === user.password;
		if (result) {
			res.render("secret");
		} else {
			res.status(400).json({ error: "Password mismatch!" });
		}
		} else {
		res.status(400).json({ error: "User not found!" });
		}
	} catch (error) {
		res.status(400).json({ error });
	}
});

//Logout
app.get("/logout", function (req, res) {
	req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
});


//Check if the user has logged in already!
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/login");
}

var port = process.env.PORT || 4000;
app.listen(port, function () {
	console.log("Server Initiated successfully!");
});
