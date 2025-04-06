var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');
var ObjectId = mongoose.Schema.Types.ObjectId;


var LogSchema=mongoose.Schema({


    name:{
        type:String
    },
    enrollment:{
        type:Number
    },
    rollno:{
        type:Number
    },
    date:{
        type:String
    },
    lecture:{
        type:Number
    },
    status:{
        type:String,
        default:'Pending'
    }



});

var Logs =module.exports=mongoose.model('logs',LogSchema);