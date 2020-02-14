var express = require("express");

var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose"),
flash = require("connect-flash"),
methodOveride = require("method-override")
passport = require("passport"),
localStrategy = require("passport-local"),
campgroundModel = require("./models/campground"),
Comment = require("./models/comment"),
user = require("./models/user")
seeds = require("./seed")


var commentRoutes = require("./routes/comments"),
campgroundRoutes = require("./routes/campground"),
authRoutes = require("./routes/auth")
//seeds();

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
// campgroundModel.create(
//     {
//         name: "Mubarak Village",
//         image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",
//         desc: "This is Mubarak Village No Bathrooms No water. Beautiful Place!!!"
//     }, function(err, campground){
//     if(err)
//     {
//         console.log("Something Went Wrong")
//     }
//     else
//     {
//         console.log(campground)
//     }
//     });

app.set("view engine","ejs")

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))
app.use(methodOveride("_method"))
app.use(flash())
//Passport config
app.use(require("express-session")({
     secret: "heavy website",
     resave: false,
     saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())


app.use(function(req,res,next){
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next();
})

app.use("/campgrounds/:id/comments",commentRoutes)
app.use(authRoutes)
app.use("/campgrounds",campgroundRoutes)

// var campGrounds = [
//     {name: "Mubarak Village" , image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80"},
//     {name: "Hill Park" , image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80"},
//     {name: "ChangaManga" , image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"},
//     {name: "Mubarak Village" , image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80"},
//     {name: "Hill Park" , image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80"},
//     {name: "ChangaManga" , image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"},
//     {name: "Mubarak Village" , image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80"},
//     {name: "Hill Park" , image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80"},
// ]

app.listen(3000, function(){
    console.log("The YelpCamp Server Has Started");
})