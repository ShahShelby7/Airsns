// wrap async is used for handling the errors on async functions
// it takes input of async function which is having erros and handle the review with catch method
function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}

module.exports=wrapAsync;