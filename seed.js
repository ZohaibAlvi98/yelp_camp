var mongoose = require("mongoose");
var comments = require("./models/comment")
campgroundModel = require("./models/campground");


var data = [
    {
        name: "Village Campground",
        image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        desc: "blah blah blah"
    },
    {
        name: "Desert Mesa",
        image: "https://images.unsplash.com/photo-1496545672447-f699b503d270?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        desc: "Karak place to be here."
    },
    {
        name: "Hill Park",
        image: "https://images.unsplash.com/photo-1519395612667-3b754d7b9086?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        desc: "Nicee place dear"
    }
]
function seed(){

    campgroundModel.remove({},function(err){
        if(err)
        {
            console.log(err)
        }
            console.log("removed Campgrounds!")
            comments.remove({}, function(err) {
                if(err){
                    console.log(err);
                }
                console.log("removed comments!");
            data.forEach(function(seed){
                campgroundModel.create(seed,function(err, data){
                    if(err)
                    {
                        console.log(err)
                    }
                    else
                    {
                        console.log("added a campground!")
                        comments.create({
                            text: "This place is great. But no internet",
                            author: "Moiz"
                        }, function(err,comm){
                            if(err)
                            {
                              console.log(err)
                            }
                            else
                            {
                                data.comment.push(comm)
                                data.save();
                                console.log("create new campground")
                            }
                          
                        })
                    }
                })
            })
            })
    })
  
}
module.exports = seed