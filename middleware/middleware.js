// Middlewares !
const redirectLogin = function(request,response,next){
    if(!request.session.email){
        response.redirect("/auth/register");
    }else{
        next();
    }
};

const redirectHome = function(request,response,next){
    if(request.session.email){
        response.redirect("/");
    }else{
        next();
    };
};


module.exports = {
    redirectLogin,
    redirectHome
};