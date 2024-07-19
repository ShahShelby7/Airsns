const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");

router.get("/",async(req,res)=>{
    let {catagory}=req.query;
    lists=await Listing.find({catagory:catagory});
    res.render("listings/index.ejs",lists)
});

module.exports=router;