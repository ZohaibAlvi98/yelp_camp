var express = require("express")
var router = express.Router();
var passport = require("passport"),
user = require("../models/user")

router.get("/",function(req, res){
    res.render("landing")
});

//comments route

// Auth routes
// Show register form

router.get("/register",function(req,res){
    res.render("register")
})
// sign up

router.post("/register",function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var newUser = new user({username: username})

    user.register(newUser,password, function(err,user){
        if(err)
        {
            req.flash("error",err.message)
            console.log(err)
            return res.redirect("/register")
        }
       passport.authenticate("local")(req,res,function(){
        req.flash("success","Welcome To YelpCamp " + user.username)
           res.redirect("/campgrounds")
       })
    })
})

// login form
router.get("/login",function(req,res){

    res.render("login");
})
// logic login form
router.post("/login", passport.authenticate("local",
        { 
            successRedirect: "/campgrounds",
            failureRedirect: "/login" 
        }), function(req,res){
})
//logout
router.get("/logout",function(req, res){
    req.logout();
    req.flash("success","Logged you out")
    res.redirect("/campgrounds")
})

function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
       return next()
   }
   res.redirect("/login")
}

module.exports = router;