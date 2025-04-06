var express=require('express');
var router=express.Router();


//get homepage
router.get('/',nocache,ensureAuthenticated,function(req,res){
    res.render('index');
});
function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated())
    {
        res.redirect('/users/home');
    }
    else{
        //req.flash('error_msg','Your are not logged in');
        return next();
    }
}
function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  }
module.exports=router;