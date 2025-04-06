var mongoose=require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var RequestSchema=mongoose.Schema({
    id:{
        type:ObjectId,
        unique:true
    },
    name:
    {
        type:String
    },
    longitude:
    {
        type:Number
    },
    latitude:
    {
        type:Number
    },
    pickuplocation:
    {
        type:String
    },
    time:{
        type:String
    },
    reqstatus:
    {
        type:Number,
        default:0
    },
    acceptedBy:{
        type:ObjectId,
        default:null
    }});
var RequestSchema=module.exports=mongoose.model('RequestSchema',RequestSchema);
