var mongoose=require('mongoose');


var teacherSchema=mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId
    },
    name:{
        type:String
    },
    1:{
        type:Number,
        default:0
    },
    2:{
        type:Number,
        default:0
    },
    3:{
        type:Number,
        default:0
    },
    4:{
        type:Number,
        default:0
    },
    5:{
        type:Number,
        default:0
    },
    6:{
        type:Number,
        default:0
    },
    7:{
        type:Number,
        default:0
    },
    8:{
        type:Number,
        default:0
    },
    9:{
        type:Number,
        default:0
    },
    10:{
        type:Number,
        default:0
    },
    11:{
        type:Number,
        default:0
    },
    12:{
        type:Number,
        default:0
    },
    all:{
        type:Number,
        default:0
    },
    outof_all:{
        type:Number,
        default:250
    },
    outof_month:{
        type:Number,
        default:24
    },
    last_modified:{
        type:String
    }
});

teacherSchema.index({'userID':1,'last_modified':1},{unique:true});




var teacherAttendance =module.exports=mongoose.model('teacherAttendance',teacherSchema);