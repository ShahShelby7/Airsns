const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.addNewReview=async(req,res)=>{   //isloggedin middleware check weather user is logged in to write a review
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    (await newReview.save());
    await listing.save();
    req.flash("success","Review is Added"); 
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    // deleting the review id from the array of the listing
    await Listing.findByIdAndUpdate(id , {$pull:{reviews:reviewId}});   //pull will pull the object id of review from the array of reviews in listing
    req.flash("success","Review is Deleted"); 
    res.redirect(`/listings/${id}`)
}