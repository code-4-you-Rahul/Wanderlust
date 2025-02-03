const express = require("express");
const lrouter = express.Router();
const list = require("../models/listing.js");
const wrapasync = require("../utils/WrapAsync.js");
const {listingschema}= require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn,isOwner} = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});

//listing validate function
const listingvalidateschema = (req,res,next)=>{
    let {error} = listingschema.validate(req.body);
    if(error){
        console.log(error);
        throw new ExpressError(400,error);
        g
        }
        else{
            next();
        }
};
lrouter.route("/")
.get(wrapasync(listingControllers.index))
.post(isLoggedIn,upload.single("listing[image]"),listingvalidateschema,wrapasync(listingControllers.save));

lrouter.get("/search",async(req,res)=>{
    let listarray = [];
    let {searchvalue} = req.query;
       let listings = await list.find({});
       for(let list of listings){
        if(list.location.split(",").includes(searchvalue)){
            listarray.push(list);
        }
       }
       if(listarray.length > 0){
        res.render("listings/search.ejs",{listarray});
       }
       else{
        req.flash("error","this type of location not exist in our connection");
        res.redirect("/listings");
       }
});
//show route
lrouter.get("/show/:id",wrapasync(listingControllers.show));
//new route
lrouter.get("/new",isLoggedIn,listingControllers.new);

//edit route
lrouter.get("/edit/:id",
    isLoggedIn,
    isOwner,
    wrapasync(listingControllers.edit));
//edited value
lrouter.route("/:id")
.patch(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    listingvalidateschema,
    wrapasync(listingControllers.editedValue))
.delete(
        isLoggedIn,
        isOwner,
        wrapasync(listingControllers.destroy));

      

module.exports = lrouter;