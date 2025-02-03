const list = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken});


module.exports.index = async (req,res)=>{
    const lists = await list.find();
    res.render("listings/index.ejs",{lists});
};
module.exports.show = async(req,res)=>{
    let {id} = req.params;
    const value = await list.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("owner");
    if(!value){
       req.flash("error","listing you requrested does not exist");
       res.redirect("/listings");
    }
    res.render("listings/show.ejs",{value});
};
module.exports.new = (req,res)=>{
    res.render("listings/new.ejs")
};
module.exports.save = async(req,res,next)=>{
 let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
     let newlist = new list(req.body.listing);
     newlist.owner = req.user._id;
     newlist.image = {url,filename};
     newlist.geometry = response.body.features[0].geometry;
  await newlist.save();
  req.flash("success","new listing created");
  res.redirect("/listings");
};
module.exports.edit = async(req,res)=>{
let {id} = req.params;
const value = await list.findById(id);
if(!value){
    req.flash("error","listing not exist");
    res.redirect("/listings");
}
let originalUrl = value.image.url;
originalUrl = originalUrl.replace("/upload","/upload/w_250");
res.render("listings/edit.ejs",{value,originalUrl});
};
module.exports.editedValue = async (req,res)=>{
    let{id} = req.params;
    let listing = await list.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true},{new:true});
    if(typeof(req.file) !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","listing updated");
    res.redirect(`/listings/show/${id}`);
};
module.exports.destroy = async (req,res)=>{
    let {id} = req.params;
    await list.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");
    };