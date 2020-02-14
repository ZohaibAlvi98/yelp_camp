var express = require("express")
var router = express.Router({mergeParams: true});
var campgroundModel = require("../models/campground"),
Comment = require("../models/comment")


router.get("/new", isLoggedIn, function(req, res){
    var id= req.params.id;
    campgroundModel.findById(id,function(err,camp){
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.render("commentsNew", {campground : camp});
        }
    })
})



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error","Please login First!")
    res.redirect("/login")
 }
router.post("/", isLoggedIn,function(req,res){
    var id= req.params.id;
    campgroundModel.findById(id,function(err,camp){
        if(err)
        {
            console.log(err)
            res.redirect("/campgrounds")
        }
        else
        {
            var newComment = req.body.comment
            Comment.create(newComment,function(err,comm){
                if(err)
                {
                    req.flash("error","Somenthing Went Wrong!")
                    console.log(err)
                }
                else
                {
                    comm.author.username = req.user.username
                    comm.author.id = req.user._id
                    comm.save();
                    camp.comment.push(comm)
                    camp.save();
                    req.flash("success","Successfully added Comment!")
                    res.redirect("/campgrounds/" + camp._id)
                }
            })
        }
    })
})

router.get("/:comments_id/edit",checkOwnershipComment, function(req,res){
    var campId = req.params.id
    var commId = req.params.comments_id
    Comment.findById(commId,function(err, foundComm){
        if(err){
            console.log(err)
            res.redirect("back")
        }
        else {
            res.render("commentEdit",{campground_id: campId, comments: foundComm})
        }
    })
   
})

router.put("/:comm_id",checkOwnershipComment,function(req,res){
    var commId = req.params.comm_id,
    comment = req.body.comment
    Comment.findByIdAndUpdate(commId,comment,function(err,updComm){
        if(err){
            res.redirect("back")
        }
        else
        {
            
            res.redirect("/campgrounds/"+ req.params.id)
        }
    })
})

router.delete("/:comments_id",checkOwnershipComment,function(req,res){
    var commId = req.params.comments_id
    Comment.findByIdAndRemove(commId,function(err,delComm){
        if(err){
            res.redirect("back")
        }
        else{
         
            res.redirect("back")
        }
    })
})

function checkOwnershipComment(req,res,next){
    if(req.isAuthenticated()){
        var id = req.params.comments_id;
        Comment.findById(id,function(err, foundComm){
            if(err){
                req.flash("error","Comment Not Found!")
                res.redirect("back")
            }
            else {
                if(foundComm.author.id.equals(req.user._id)){
                    next()
                }
                else {
                    req.flash("error","You don't have permission")
                    res.send("u dont have permission")
                }
            }
        })
     }
     else {
        req.flash("error","Please login First!")
        res.redirect("back")
    }

}

module.exports = router;