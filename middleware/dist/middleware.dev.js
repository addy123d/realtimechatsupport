"use strict";

// Middlewares !
var redirectLogin = function redirectLogin(request, response, next) {
  if (!request.session.email) {
    response.redirect("/auth/register");
  } else {
    next();
  }
};

var redirectHome = function redirectHome(request, response, next) {
  if (request.session.email) {
    response.redirect("/");
  } else {
    next();
  }

  ;
};

module.exports = {
  redirectLogin: redirectLogin,
  redirectHome: redirectHome
};