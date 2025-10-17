const Listing=require("../models/listing.js");

module.exports.index=async (req,res)=>{
    let lists=await Listing.find();
    res.render("listings/index.ejs",{lists});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}


module.exports.createListing=async (req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let list1=new Listing({...req.body});  //req.body contain name and value pair of title description.. and ... will expand the body
    list1.owner=req.user._id;   //while creating a new listing owner details will be added by the req(passport will save info of a user)
    list1.image={url,filename};
    await list1.save();
    req.flash("success","New listing is added");  //here is flash message is saved as cookie
    res.redirect("/listings");
}


module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const list = await Listing.findById(id)
    .populate({                     //here we are using nested populate(fisrt populate review(then populate the author in it) )
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner").populate("reviews.author");   //we find only ids of the reviews,so pouplate method will access the review from that id
    if (!list) {
        req.flash("error","Listing not found");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { list });
}


module.exports.renderUpdateForm=async (req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id);

    let LowQualImage=list.image.url;
    LowQualImage=LowQualImage.replace("/upload","/upload/w_200");
    res.render("listings/edit.ejs",{list,LowQualImage});
}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body});   //  (...) is spread syntax
    
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing is Updated");
    res.redirect("/listings");
}
 
module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted"); 
    res.redirect("/listings");
}


module.exports.searchResults=async(req,res)=>{
    let {loc}=req.body;
    lists=await Listing.find({country:loc});
    res.render("listings/index.ejs",lists)
}