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

mongoose.connect("mongodb+srv://admin-zohaib:prince1234@cluster0-x8iaz.mongodb.net/yelp_camp", { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

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

app.listen(process.env.PORT || 5000)