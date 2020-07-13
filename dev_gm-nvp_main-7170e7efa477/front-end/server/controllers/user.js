/**
 * Account controller.
 * Sign in, sign out, forgot password etc.
*/
var User = require("../models/user").user,
    memcache = require("../lib/Memcache").mcClient,
    smtp = require("../lib/Smtp"),
    templateHelper = require("../helpers/TemplateHelper"),
    mainHelper = require("../helpers/MainHelper"),
    logger = require('../utility/logger'),
    config = require("../config");

/**
 * Check user authorizated
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 * @return response message
 */
function authorizated(req, res, next) {
  var stoken = req.params.stoken;
  memcache.get(stoken, function(error, result) {
    if (error == "NOT_FOUND" || result === null) {
      error = new Error("User does not authorizated.")
    }
    if (error) {
      next(error)
    } else {
      if (typeof req.body.user_id === 'undefined') {
        req.body.user_id = JSON.parse(result).user_id
      } else {
        req.body.auth_user_id = JSON.parse(result).user_id
      }
      next()
    }
  })
}

/**
 * User sign in
 * @param  {Object} req request
 * @param  {Object} res response
 * @param  {Function} next next
 * @return response message
 */
function signIn(req, res, next) {

  logger.info("Controller: /admin/login:");

  var user = new User(req.body)
  user.login(function(error, result) {
    if (error) {
      next(error)
    } else {
      res.send({
        status: "ok",
        message: "Signed in.",
        user: result,
        stoken: result.stoken
      })
    }
  })
}

/**
 * User sign up
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 * @return response message
 */
function signUp(req, res, next) {

  logger.info("Controller: /user/create:");

  req.body.user_type = "admin";
  req.body.parent = 0;
  var user = new User(req.body)
  user.save(function(err, result) {
    if (err) {
      next(new Error(JSON.stringify(err)))
    } else {
      res.send({
        status: "ok",
        message: "Your account has been created."
      })
    }
  })
}
/**
 * User sign up
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 * @return response message
 */
function addUser(req, res, next) {

  logger.info("Controller: /user/addUser:");

  var user = new User(req.body)
  user.addUser(function(error, result) {
    if (user.user_id == null) {
      next(error)
    } else {
      var html = templateHelper.getHtml("email/create_user.html",{ username: result.username, password: result.user_password});
      smtp.sendMail(
        {
          from: config.supportEmail,
          to: user.user_email,
          subject: "User created",
          html: html,
          generateTextFromHTML: true
        },
        function(error, result) {
          if (error) {
            next(new Error(error));
          }else{
            res.send({
              status: "ok",
              message: "Please check your email."
            });
          }
        }
      );
    }
  })
}

/**
 * User update : Invitation sign up 
 */
function completeInvitation(req, res, next) {
  var user = new User(req.body);
  user.completeInvitationSignUp(function(error, result) {
    if (error) {
      next(error);
    } else {
      user.getInfo(function(error, result) {
        if (error) {
          next(error);
        } else {
          res.send({
            status:  "ok",
            message: "Your information has been updated.",
            rec: result
          });
        }
      });
    }
  });
};
/**
 * User update
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 * @return response message
 */
function update(req, res, next) {
  var user = new User(req.body)
  user.update(function(error, result) {
    if (error) {
      next(error)
    } else {
      user.getInfo(function(error, result) {
        if (error) {
          next(error)
        } else {
          res.send({
            status:  "ok",
            message: "Your information has been updated.",
            rec: result
          })
        }
      })
    }
  })
}

/**
 * Get user information
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 * @return response message
 */
function getInfo(req, res, next) {
  
  var user = new User(req.body)
  user.getInfo(function(error, result) {
    if (error) {
      next(error)
    } else {
      res.send({
        status:  "ok",
        rec: result
      })
    }
  })
}

/**
 * User sign out
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 */
function signOut(req, res, next) {
  var stoken = req.params.stoken
  memcache.delete(stoken, function(error, result) {
    res.send({
      status: "ok",
      message: "Signed out."
    })
  })
}

/**
 * If user forgot password
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next [description]
 */
function forgotPassword(req, res, next) {
  
  // Initialise User with req body (username or email )
  var user = new User(req.body);
  logger.info("Controller: /user/forgot:"+req.body.user_email);
  //Validate username or email is registered or not
  if(typeof req.body.username != 'undefined'){
    user.findByUsername(function(error, result) {
      if (error) {
        next(error);
        res.send({
          status:  "error",
          message: "User not registered.",
          rec: result
        });
      } else if(typeof result === "undefined"){
        res.send({
          status:  "error",
          message: "User not registered.",
          rec: result
        });
      }
    });
  }
  if(typeof req.body.user_email != 'undefined'){
    user.findByEmail(function(error, result) {
      if (error) {
        next(error);
        res.send({
          status:  "error",
          message: "User not registered.",
          rec: result
        });
      }else if(typeof result === "undefined"){
        res.send({
          status:  "error",
          message: "User not registered.",
          rec: result
        });
      }
    });
  }
  
  // New Confirmation code
  var code = mainHelper.randomToken();
  
  // send mail 
  var sendEmail = function(userRec) {
    var html = templateHelper.getHtml("email/password_reset.html",{ link: config.passwordResetLink + "/"+ userRec.user_id + "/" + code });

    smtp.sendMail(
        {
          from: config.supportEmail,
          to: userRec.user_email,
          subject: "Password Reset",
          html: html,
          generateTextFromHTML: true
        },
        function(error, result) {
          if (error) {
            next(new Error(error));
          }else{
            res.send({
              status: "ok",
              message: "Please check your email."
            });
          }
        }
    );
    
  };
  
  //Update record with new Confirmation code
  var UpdateRecord = function(userRec) {
    var userM = new User({
      user_id: userRec.user_id,
      user_email_confirmation_code: code
    });
    userM.updateData(function(error, result) {
      if (error) {
        next(error);
      } else {
        sendEmail(userRec);
      }
    });
  };
  
  // check is there any user with this email or username 
  user.getInfo(function(error, result) {
    if (!error && typeof result === "undefined") {
      error = new Error("User with this email or username has not found.");
    }
    if (error) {
      next(error);
    } else {
      UpdateRecord(result); 
    }
  });
}

/**
 * User reset password, set new password
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next [description]
 */
 function resetPassword(req, res, next) {

  logger.info("Controller: /user/reset:");

  var user = new User(req.body)
  user.user_email_confirmation_code = req.body.code
  // New password
  //var newPwd = mainHelper.randomNumber()
  user.user_password = req.body.user_password;
  
  user.findByConfirmationCode(function(error, userRec) {
    if (!error && typeof userRec === "undefined") {
      error = new Error("Code is not correct.")
    }
    if (error) {
      next(error)
    } else {
      // Update record with new password
      var userM = new User({
        user_id : userRec.user_id,
        user_password : user.user_password
      })
      userM.updateData(function(error, result) {
        if (error) {
          next(error);
        } else {
          userRec.password = user.user_password;
          res.send({
            status: "ok",
            message: "Password has been reset.",
            rec : userRec
          }); 
        }
      });
    }
  })
}

/**
 * Get user list
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 * @return response message
 */
function listUsers(req, res, next) {
  var user = new User({
    parent: req.params.parent
  })
  user.getUsers(function(error, result) {
    if (error) {
      next(error)
    } else {
      res.send({
        status:  "ok",
        rec: result
      })
    }
  })
}

/**
 * Get user list
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 * @return response message
 */
function getUserType(req, res, next) {
  var user = new User({
    user_type: req.params.user_type
  })
  user.getUserType(function(error, result) {
    if (error) {
      next(error)
    } else {
      res.send({
        status:  "ok",
        rec: result
      })
    }
  })
}
/**
 * User update
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 * @return response message
 */
function updateUser(req, res, next) {
  var user = new User(req.body)
  user.updateData(function(error, result) {
    if (error) {
      next(error)
    } else {
      res.send({
        status:  "ok",
        rec: result
      })
    }
  })
}

/**
 * User delete
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 * @return response message
 */
function deleteUser(req, res, next) {
  var user = new User({
    user_id: req.params.user_id
  })
  user.deleteUser(function(error, result) {
    if (error) {
      next(error)
    } else {
      res.send({
        status:  "ok",
        rec: result
      })
    }
  })
}

/**
 * Get user role
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 * @return response message
 */
function getUserRole(req, res, next) {
  var user = new User({
    user_id: req.params.user_id
  })
  user.getUserRole(function(error, result) {
    if (error) {
      next(error)
    } else {
      res.send({
        status:  "ok",
        rec: result
      })
    }
  })
}


module.exports = {
    authorizated: authorizated,
    signIn: signIn,
    signUp: signUp,
    addUser: addUser,
    listUsers: listUsers,
    getUserType: getUserType,
    updateUser: updateUser,
    deleteUser: deleteUser,
    completeInvitation: completeInvitation,
    update: update,
    getInfo: getInfo,
    signOut: signOut,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    etUserRole: getUserRole
}
     
     
     
     
     
     
     
     
     
     