// I couldn't figure out how to implement three of the fields properly,
// so I just made them text fields.
const mongoose=require("mongoose");
const eventSchema=mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    location:{type:String,required:true},
    startDate:{type:Date,required:true},
    endDate:{type:Date,required:true},
    // isOnline:{type:Boolean,default:false},
    isOnline:{type:String,required:true},
    registrationLink:{type:String},
    // organizer:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    // attendees:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
    organizer:{type:String,required:true},
    attendees:{type:String}
});
module.exports = mongoose.model("Event",eventSchema);