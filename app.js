if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session");  //for session   //here bydefault session storage is not meant for prodution purpose its only for develop stage
const MongoStore=require("connect-mongo")   //its for production purpose(it store the session in mongodb rather than local storage)
const flash=require("connect-flash");     //for flash
const passport=require("passport");       //for authentication
const LocalStratergy=require("passport-local")
const User=require("./models/user.js");
const dbURL=process.env.dbURL;    

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const Store=MongoStore.create({
    mongoUrl:dbURL,   //it defines the storage of session as mongodb atlas
    crypto:{  
        secret:process.env.SECRET,
    },
    touchAfter:24*3600, //its says that session updates after 24 hrs
});

Store.on("error",()=>{
    console.log("error in mongo session store",err);
})

//for using session
const sessionOptions={
    store:Store,    //now this says that session is going to store in mongodb atlas
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+ 4*24*60*60*1000,
        maxAge:4*24*60*60*1000,
        httpOnly:true
    }
}

app.use(session(sessionOptions));
//for flash (flash uses session to store msg)
app.use(flash());

//for authentication(passprt also require session)
app.use(passport.initialize());  //initilazing the passport as a middleware
app.use(passport.session());     //passport also uses sessions because one user no need to authenticate many times in a single session(session will remember the creds of user)
passport.use(new LocalStratergy(User.authenticate()));  //passport middleware need to use local Stratergy while authentication

passport.serializeUser(User.serializeUser());    //adds user details to session
passport.deserializeUser(User.deserializeUser());


async function main(){
    // await mongoose.connect("mongodb://127.0.0.1:27017/HODOPHILES");
    await mongoose.connect(dbURL);
}
main().then(()=>{
    console.log("connnected to DataBase");
}).catch((err)=>{
    console.log(err);
});

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});

app.get("/",(req,res)=>{
    res.redirect("/listings")
});

// middleware to access the flash cookie
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");    //here locals are send for page rendering in below routes  ||| by using locals we donot need to explicitly send the sucess variable for every rendering page
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;    //req.user will save the info of logged person (will be used while signup and logout at navbar)
    next();
});



// we save all the routes in different js files in routes folder
const listingRoute=require("./routes/listings.js");
const reviewRoute=require("./routes/review.js");   //this will requires all the routes
const userRoute=require("./routes/user.js");
const Catagory=require("./routes/catagory.js")

app.use("/listings",listingRoute);  //this middleware will find and check the route starting with /listings at the ./routes/listings.js file
app.use("/listings/:id/review",reviewRoute); //this middleware will check the route starting with parent route(/listings/:id/review) at the review.js file
app.use("/",userRoute);
app.use("/catagory",Catagory);




// error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="Some Error"}=err;
    res.status(status).send(message);
});