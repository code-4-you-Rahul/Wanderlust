const mongoose = require("mongoose");
const review = require("./review.js");
const listingschema = new mongoose.Schema(
    {
        title:{
            type:String,
            required : true
        },
        description : {
            type:String
        },
        image:{
            url:String,
            filename:String                  
        },
        price:{
            type : Number,
            min : 1
        },
        location:{
            type : String,
            required:true
        },
        country:{
            type:String
        },
        reviews:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"review"
        }],
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
      geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
      }
    }
);
listingschema.post("findOneAndDelete",async(list)=>{
    if(list.reviews.length){
    await review.deleteMany({_id:{$in:list.reviews}});
}});
const list = mongoose.model("list",listingschema);

module.exports = list;

