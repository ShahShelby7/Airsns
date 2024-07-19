const User=require("../models/user.js");

module.exports.renderSignUp=(req,res)=>{
    res.render("users/SignUp.ejs");
}


module.exports.signUp=async(req,res)=>{
    try{
        let {email,username,password}=req.body;
        let newUser=new User({email,username});
        let registereduser=await User.register(newUser,password);  //this method works becoause we used passportLocalMongoose in User schema creation
        // console.log(registereduser);   //upto here we have successfully signed up
        req.login(registereduser,(err)=>{    //if signed up then login that person by req.login (passport method)
            if(err){
                return next(err);
            }
            req.flash("success","You have successfully registered !!!  Welcome To Airsns");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/SignUp");
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome Back to Airsns");
    res.redirect("/listings");
}

module.exports.logout=(req,res)=>{
    req.logout((err)=>{    //req.logout() is passport method 
        if(err){
            return next(err);
        }
        req.flash("success","you have logged out");
        res.redirect("/listings");
    });
}