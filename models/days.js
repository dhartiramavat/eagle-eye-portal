var mongoose=require('mongoose');
var daysSchema=mongoose.Schema({
    month:{
        type:Number,
        unique:true
    },
    value:
    {
        type:Number
    }
});




var Day =module.exports=mongoose.model('Day',daysSchema);