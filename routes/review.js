const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const MyErr=require("../MyErr.js");
const {reviewSchema } = require("../schema.js");  // server side validation(error throwing middlewares)
const {isLoggedin,isreviewOwner}=require("../middleware.js");
const {reviewController, addNewReview,deleteReview}=require("../controller/review.js")

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new MyErr(404,errMsg);
    }else{
        next();
    }
};


// post request(we donot need any other route like index and new because it can be accessed with listing only)
router.post("/",isLoggedin,validateReview,wrapAsync(addNewReview));


// review delete 
router.delete("/:reviewId",isLoggedin,isreviewOwner,deleteReview);


module.exports=router