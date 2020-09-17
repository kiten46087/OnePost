var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res) {
  res.render("landing");
});


// Auth routes
router.get("/register", function(req, res) {
  res.render("register");
});


router.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/posts");
    });
  });
});

// Show login form
router.get("/login", function(req, res) {
  res.render("login");
});

// hanlde login request
router.post("/login", passport.authenticate("local",
 {
   successRedirect: "/posts",
   failureRedirect: "/login"
  }), function(req, res) {

});

// logout route
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/posts");
});

// Middleware 
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
