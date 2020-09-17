var express = require("express");
var router = express.Router();
var Post = require("../models/post");

router.get("/posts", function(req, res) {
  // Get all the posts
  Post.find({}, function(err, allPosts) {
    if (err) {
      console.log("err");
    } else {
      res.render("posts/index", {posts: allPosts, currentUser: req.user});
    }
  });
  
});

router.post("/posts", isLoggedIn,function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;

  var author = {
    id: req.user._id,
    username: req.user.username
  }

  var newPost = {name: name, image: image, description: description, author: author};

  // Create a new post and save back to DB
  Post.create(newPost, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      // Redirect
      res.redirect("/posts");
    }
  });  
});


router.get("/posts/new", isLoggedIn,function(req, res) {
  res.render("posts/new");
});


router.get("/posts/:id", function(req, res) {
  Post.findById(req.params.id).populate("comments").exec(function(err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      res.render("posts/show", {post: foundPost});
    }
  });
}); 

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;