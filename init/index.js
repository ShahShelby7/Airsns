//this file will access the database and initialize with some data that can be used
const mongoose=require("mongoose");
let initdata=require("./data.js");
const Listing=require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/HODOPHILES");
}
main().then(()=>{
    console.log("connnected to DataBase");
}).catch((err)=>{
    console.log(err);
});

async function Initialize(){
    await Listing.deleteMany();
    initdata=initdata.map((obj)=>({...obj,owner:"664e1b6baa8e7a0b8d6c2f32"})) //here we manipulate the data by adding the new attribute to the listing schmema
    await Listing.insertMany(initdata) //array passed
    console.log("data was initializd")
}
Initialize().catch(console.error);