const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");   // wrap async is used for handling the errors on async functions
const {isLoggedin,isOwner}=require("../middleware.js");
const {validateListing}=require("../middleware.js")
const listingController=require("../controller/listing.js")
const multer  = require('multer');
const {storage}=require('../cloudConfig.js');
const Listing = require("../models/listing.js");
const upload = multer({storage})



//index route(show all listings)
router.get("/",listingController.index);


// new request
router.get("/new",isLoggedin,listingController.renderNewForm);   //isLoggedIN is a middleware and rendernewform is the final controller(thats why middleware have next and controller dont)

//post request(posting data into listing model (database))
// router.post("/",(req,res)=>{console.log(req.body)})
router.post("/",isLoggedin,upload.single('image'),validateListing,wrapAsync(listingController.createListing));    //wrapAsync(listingController.createListing)


// show route
// Route for fetching a each listing by id (:) is used cause id chanes on every request
router.get("/:id", wrapAsync(listingController.showListing));


//update route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.renderUpdateForm));
router.put("/:id",isOwner,upload.single('image'),validateListing,wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id/delete",isLoggedin,isOwner,wrapAsync(listingController.deleteListing));

//search
router.post("/search",listingController.searchResults)


module.exports=router;