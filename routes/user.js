const express=require("express");
const router=express.Router();
const passport=require("passport");
const userController =require("../controller/user.js")


//new user
router.get("/SignUp",userController.renderSignUp);

//signup
router.post("/SignUp",userController.signUp);

//new login page
router.get("/login",userController.renderLogin);
//login
router.post("/login",
        passport.authenticate("local",{failureRedirect:"/login" ,failureFlash:true}),  //as a middleware to authenticate
        userController.login
);


//logout
router.get("/logout",userController.logout)

module.exports=router