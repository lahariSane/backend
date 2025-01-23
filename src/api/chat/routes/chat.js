'use strict';

const { policy } = require('@strapi/utils');

/**
 * chat router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/fetchMessages',  // Define the route with params
            handler: 'chat.findMessagesBetweenUsers',      // This should match the controller function
        },
        {
            method: 'POST',
            path: '/sendMessage',  // The route for adding a message
            handler: 'chat.sendMessage',  // The controller method that handles sending a message
        },
        {
            method: 'POST',
            path: '/checkUserEmail',  // The route for checking if a user exists
            handler: 'chat.checkUserEmail',  // The controller method that handles checking if a user exists
            config: {
                middlewares: ['global::headerValidation'],
            },
        },
    ]
}