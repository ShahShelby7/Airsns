const Listing=require("./models/listing.js")
const Review=require("./models/review.js")
const MyErr=require("./MyErr.js");
const { listingSchema } = require("./schema.js");  // server side validation(error throwing middlewares)


module.exports.isLoggedin=(req,res,next)=>{ 
    if(!req.isAuthenticated()){           //req.user bydefault saves the info of user who loggedin
        req.flash("error","User must login to perform changes");
        return res.redirect("/login");
    }
    next();
}

// this is middleware used before Every listing route to check whether he is logged in or not

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id)
    let ownerId=listing.owner._id
    if(req.user && !req.user._id.equals(ownerId)){    //here ownerid in listing detail and present logged user details will be compared  //req will save the info of logged user by passport
        req.flash("error","You are not Allowed to do this");     
        return res.redirect(`/listings/${id}`)
    }
    next();
}
module.exports.isreviewOwner=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    let ownerId=review.author;
    if(req.user && !req.user._id.equals(ownerId)){    //here ownerid in listing detail and present logged user details will be compared
        req.flash("error","You are not Allowed to do this");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateListing=(req,res,next)=>{
    // console.log(req.body)
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new MyErr(404,errMsg);
    }else{
        next();
    }
};