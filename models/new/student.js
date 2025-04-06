var mongoose=require('mongoose');


var studentSchema=mongoose.Schema({
    name:{
        type:String
    },
    standard:{
        type:Number
    },
    mobile:{
        type:Number,
        default:0
    },
    dob:{
        type:String,
        default:""
    },
    gender:
    {
        type:String
    },
    address:{
        type:String
    }
});
var Student =module.exports=mongoose.model('Student',studentSchema);