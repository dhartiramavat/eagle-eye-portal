var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');
var ObjectId = mongoose.Schema.Types.ObjectId;


var RequestSchema=mongoose.Schema({


    StudentID:{
        type:ObjectId
    },
    name:{
        type:String
    },
    enrollment:{
        type:Number
    },
    date:{
        type:Date
    },
    lecture:{
        type:Number
    },
    status:{
        type:String,
        default:'Pending'
    }



});

var Request =module.exports=mongoose.model('Request',RequestSchema);