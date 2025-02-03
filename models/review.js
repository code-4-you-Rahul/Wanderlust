const mongoose = require("mongoose");
const reviewschema = new mongoose.Schema({
rating:{
    type:Number,
    min:1,
    max:5
},
comment:{
    type:String,
},
created_at:{
    type:Date,
    default:new Date(Date.now())
},
author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}
});
const review = mongoose.model("review",reviewschema);
module.exports = review;