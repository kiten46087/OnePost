var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Post = require("./models/post");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seed");
var passport = require("passport");
var LocalStrategy = require("passport-local");

// Require routes
var commentRoutes = require("./routes/comments");
var postRoutes = require("./routes/posts");
var indexRoutes = require("./routes/index");


// seedDB();
mongoose.connect("mongodb://localhost/onepost", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


// PASSPORT Configuration
app.use(require("express-session")({
  secret: "blablabla",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use(postRoutes);
app.use(commentRoutes)

app.listen(3000, function() {
  console.log("Started");
});