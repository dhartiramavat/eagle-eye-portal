var mongoose=require('mongoose');

var reportSchema=mongoose.Schema({
    studentID:{
        type:mongoose.Schema.Types.ObjectId
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId
    },
    student:{
        type:String
    },
    teacher:{
        type:String
    },
    subject:{
        type:String
    },
    chapter:{
        type:String
    },
    topics:{
        type:String,
        default:null
    },
    remarks:{
        type:String,
        default:null
    },
    created_on:{
        type:String
    }
});
//reportSchema.index({created_on:1,studentID:1},{unique:true});
reportSchema.index({'studentID':1,'created_on':1},{unique:true});
var Report =module.exports=mongoose.model('Report',reportSchema);