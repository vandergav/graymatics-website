var userListModel = require("../models/alert_user.js"),
    logger = require('../utility/logger');


/**
 * Create Contact
 *
 */
function createUser(req, res, next){

    logger.info('Controller: executing createUser() ');

    var user_list = new userListModel(req.body);

    user_list.save(req.body, function (err, result) {
      if (err){
        console.log("Error : ",err);
        next(err);
      }else{
        res.send({
            'status' : 'success',
            'message' : 'User created successfully ',
            'data' : result
        });
      }
    });
}

function updateUser(req, res, next){

    logger.info('Controller: executing updateUser() ');

    userListModel.findByIdAndUpdate(req.body._id, req.body, function(err, result) {
      if (err){
        console.log("Error : ",err);
        next(err);
      }else{

        logger.info("user update :: ",result);

        res.send({
            'status' : 'success',
            'message' : 'User updated successfully ',
            'data' : result
        });
      }
    });
}

function listUsers(req, res, next){

    logger.info('Controller: executing listUsers() ');

    userListModel.find(function(error, user_list) {
      if(error){
        console.log("Error : ",error);
        next(error);
      }else{

        logger.info("user list :: ",user_list);

        if((user_list != null) && (user_list.length > 0)){
          res.send({
              'status' : 'success',
              'data' : user_list
          });
        }else{
            res.send({
                'status' : 'success',
                'message' : 'No User List Found',
                'data' : []
            });
        }
      }
    });
}

function deleteUser(req, res, next){

    logger.info('Controller: executing deleteUser() ');

    userListModel.remove({ _id: req.params._id }, function(error, result){
      if(error){
        res.send({
            'status' : 'error',
            'message' : 'FAILED TO REMOVE USER LIST'
        });
      }else{
        res.send({
            'status' : 'success',
            'message' : 'USER LIST REMOVED SUCCESSFULLY'
        });
      }
    });
}

module.exports = {
    createUser: createUser,
    updateUser: updateUser,
    listUsers: listUsers,
    deleteUser: deleteUser
};
