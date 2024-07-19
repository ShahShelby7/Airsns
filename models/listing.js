const mongoose=require("mongoose");
const Review=require("./review.js");
const User=require("../models/user.js");
const { string } = require("joi");

const listSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        url:String,
        filename:String,    
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    // one listing can have multile reviews(array of reviews) with that one to many relation 
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    catagory:{
        type:String,
        enum:["Trending","Rooms","Iconic Cities","Mountains","Pools","Farm","castle","Boats","Trees"],
        default:"Trending",
    }
});

// when the listing is deleted then the corresponding reviews have to be deleted
// mongoose post middleware
listSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }  
})


const Listing=new mongoose.model("Listing",listSchema);//creating model with schema
//    this |                      this |        must be same


module.exports=Listing;//exporting the collection Listing