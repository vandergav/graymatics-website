/**
 * Account controller.
 * Sign in, sign out, forgot password etc.
*/
var User = require("../models/user"),
    memcache = require("../lib/Memcache").mcClient,
    smtp = require("../lib/Smtp"),
    templateHelper = require("../helpers/TemplateHelper"),
    mainHelper = require("../helpers/MainHelper"),
    logger = require('../utility/logger'),
    mainHelper = require("../helpers/MainHelper"),
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

  User.find(
    { username : req.body.username},
    function(error, result) {
    if (error) {
      next(error)
    } else {
      if (typeof result[0] === "undefined" || !mainHelper.stringCryptTest(req.body.user_password, result[0].user_password)) {
        err = new Error("Invalid username or password. Please try again.")
        next(err);
      } else {
        result[0].stoken = mainHelper.randomToken()
        memcache.set(result[0].stoken, JSON.stringify({user_id: result[0].user_id}))
        res.send({
          status: "ok",
          message: "Signed in.",
          user: result[0],
          stoken: result[0].stoken
        })
      }
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
  req.body.user_email_confirmed = 'Y';
  req.body.user_password = mainHelper.stringCrypt(req.body.user_password)
  req.body.user_id = mainHelper.randomToken();
  req.body.user_email_confirmation_code = mainHelper.randomToken();

  var user = new User(req.body)

  user.save(req.body, function(err, result) {
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

  var user_email_confirmation_code = mainHelper.randomToken();
  var randomToken = mainHelper.randomToken();
  req.body.user_password = mainHelper.stringCrypt(randomToken);
  req.body.user_email_confirmed = 'Y';
  req.body.user_id = mainHelper.randomToken();
  req.body.user_email_confirmation_code = mainHelper.randomToken();

  user.save( req.body, function(error, result) {
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
  
  logger.info("Controller: /user/forgot:");
  //Validate username or email is registered or not
  if(typeof req.body.username != 'undefined'){
    User.find(
      { username : req.body.username },
      function(error, result) {
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
      }
    );
  }
  if(typeof req.body.user_email != 'undefined'){
    User.find(
      { user_email : req.body.user_email },
      function(error, result) {
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
      }
    );
  }
  
  // New Confirmation code
  var code = mainHelper.randomToken();
  
  // send mail 
  var sendEmail = function(userRec) {
    var html = templateHelper.getHtml("email/password_reset.html",{ link: config.passwordResetLink + "/"+ userRec.user_id + "/" + code });
    logger.info("userRec in sendEmail:",JSON.stringify(userRec));
    smtp.sendMail(
        {
          from: config.supportEmail,
          to: userRec.user_email,
          subject: "Password Reset",
          html: html,
          generateTextFromHTML: true
        },
        function(error, result) {
          logger.info("result in sendEmail:",JSON.stringify(result));
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
    logger.info("UpdateRecord data:",JSON.stringify(userRec));
    // Verify the userRec 
    if( typeof userRec === 'undefined') next(new Error("User is not found"))
    req.body.user_email_confirmation_code = code;
    User.findByIdAndUpdate(
      userRec._id,
      req.body,
      function(error, result) {
        if (error) {
          next(error);
        } else {
          sendEmail(userRec);
        }
      }
    );
  };
  
  // check is there any user with this email or username 
  User.find(
    {$or : [{ username : req.body.username },{ user_email : req.body.user_email}]},
    function(error, result) {
      if (!error && typeof result === "undefined") {
        error = new Error("User with this email or username has not found.");
      }
      if (error) {
        next(error);
      } else {
        UpdateRecord(result[0]); 
      }
    }
  );
}

/**
 * User reset password, set new password
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next [description]
 */
 function resetPassword(req, res, next) {

  logger.info("Controller: /user/reset:");

  // New password
  //var newPwd = mainHelper.randomNumber()
  
  User.find(
    { user_email_confirmation_code : req.body.code },
    function(error, userRec) {
      if (error) {
        next(error)
      } else if ( userRec.length > 0 ) {
        // Update record with new password
        req.body.user_password = mainHelper.stringCrypt(req.body.user_password);
        User.findByIdAndUpdate(
          userRec[0]._id,
          req.body,
          function(error, result) {
            if (error) {
              next(error);
            } else {
              userRec.password = User.user_password;
              res.send({
                status: "ok",
                message: "Password has been reset.",
                rec : userRec
              }); 
            }
          }
        );
      }else {
        error = new Error("Code is not correct.")
        next(error)
      }
    }
  )
}

/**
 * Get user list
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 * @return response message
 */
function listUsers(req, res, next) {
  
  User.find(
    { parent : req.params.parent },
    function(error, result) {
      if (error) {
        next(error)
      } else {
        res.send({
          status:  "ok",
          rec: result
        })
      }
    }
  )
}

/**
 * Get user list
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 * @return response message
 */
function getUserType(req, res, next) {
  
  User.find(
    { user_type: req.params.user_type },
    function(error, result) {
      if (error) {
        next(error)
      } else {
        res.send({
          status:  "ok",
          rec: result
        })
      }
    }
  )
}
/**
 * User update
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 * @return response message
 */
function updateUser(req, res, next) {

  // set the update information
  req.body.user_password = mainHelper.stringCrypt(req.body.user_password);
  req.body.update_dtime = dateHelper.toMySQL(new Date());

  User.findByIdAndUpdate(
    req.body._id, 
    req.body,
    function(error, result) {
      if (error) {
        next(error)
      } else {
        res.send({
          status:  "ok",
          rec: result
        })
      }
    }
  )
}

/**
 * User delete
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next next
 * @return response message
 */
function deleteUser(req, res, next) {

  User.remove(
    { user_id : req.params.user_id },
    function(error, result) {
      if (error) {
        next(error)
      } else {
        res.send({
          status:  "ok",
          rec: result
        })
      }
    }
  )
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
     
     
     
     
     
     
     
     
     
     