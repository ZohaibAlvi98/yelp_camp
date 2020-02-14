var express = require("express")
var router = express.Router();


function isLoggedIn(req, res, next){
    
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error","Please login First!")
    res.redirect("/login")
 }
   


router.post("/", isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price
    var image = req.body.image;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price,image: image, desc:desc, author: author}
    campgroundModel.create(newCampground, function(err,campground){
        if(err)
        {
           console.log("error")
        }
        else
        {
           
            res.redirect("/campgrounds")
        }
    })
    
    // campGrounds.push(newCampground);
    // res.redirect("/campgrounds")
  
})

router.get("/new", isLoggedIn, function(req, res){
    res.render("new");
});

router.get("/:id",function(req,res) {
    var id= req.params.id;
   campgroundModel.findById(id).populate("comment").exec(function(err, camp){
       if(err)
       {
           console.log()
       }
       else
       {
           //console.log(camp)
        res.render("show", {campground: camp})   
       }
   })
   
    // campgroundModel.findById(req.params.id, function(err, foundCamp){
    //     if(err)
    //     {
    //         console.log("here error")
    //     }
    //     else
    //     {
    //         res.render("show", {campground: foundCamp})
    //     }
    // })
    //res.render("show")
    
})

//edit campground

router.get("/:id/edit",checkOwnership,function(req, res){
    var id = req.params.id;
        campgroundModel.findById(id,function(err, foundCamp){
            res.render("edit", { campground: foundCamp})
                
        })
    
})

function checkOwnership(req,res,next){
    if(req.isAuthenticated()){
        var id = req.params.id;
        campgroundModel.findById(id,function(err, foundCamp){
            if(err){
                req.flash("error","NO Campground Found!")
                res.redirect("back")
            }
            else {
                if(foundCamp.author.id.equals(req.user._id)){
                    next()
                }
                else {
                    req.flash("error","U don't have permission")
                    res.redirect("back")
                }
            }
        })
     }
     else {
        req.flash("error","Please login First!")
        res.redirect("back")
    }

}

//update campground

router.put("/:id", checkOwnership, function(req, res){
    var id = req.params.id;
    var campground = req.body.campground
    
    campgroundModel.findByIdAndUpdate(id,campground, function(err, updCamp){
        if(err){
            
            res.redirect("/campgrounds")
        }
        else {
            req.flash("success","Updated!")
            res.redirect("/campgrounds/" + id)
        }
    })
})

//destroy

router.delete("/:id",checkOwnership, function(req, res){
    var id = req.params.id
    campgroundModel.findByIdAndRemove(id,function(err,camp){
        if(err){
            res.redirect("/campgrounds")
        }
        else {
            req.flash("success","Deleted!")
            res.redirect("/campgrounds")
        }
    })
})

router.get("/",function(req, res){
    
    campgroundModel.find({},function(err,campground){
        if(err)
        {
            console("Something Went Wrong")
        }
        else
        {
            res.render("campground",{campGrounds: campground, currentUser: req.user})
        }
    })
    //res.render("campground",{campGrounds: campGrounds})
})

module.exports = router;