const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
});
// here this plugin creates username,hash func,salting and hasing of passwords byDefault into that schema
userSchema.plugin(passportLocalMongoose);

const User= mongoose.model("User",userSchema);
module.exports =User;