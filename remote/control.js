'use strict';

var config = require('../config');
var token = config.token;

function getActionMessage(mytoken, path) {
    var message;
    if(mytoken !== undefined) {
        if(mytoken === token) {
            message = {
                status: 200,
                message: 'Action triggered correctly'
            };
        }else {
            message = {
                status: 201,
                message: 'The token is invalid'
            };
        }
    } else {
        message = {
            status: 403,
            message: 'You don\'t have access to this action'
        };
    }
    return message;
}

var control = {
    getActionMessage: getActionMessage
};

module.exports = control;
