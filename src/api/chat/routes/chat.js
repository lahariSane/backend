'use strict';

const { policy } = require('@strapi/utils');

/**
 * chat router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// module.exports = createCoreRouter('api::chat.chat', ({ strapi }) => ({
//   routes: [
//     {
//       method: 'GET',
//       path: '/fetchMessages/:senderId/:receiverId',  // Define the route with params
//       handler: 'chat.findMessagesBetweenUsers',      // This should match the controller function
//       config: {
//         auth: false, // Add authentication if needed
//       }
//     }
//   ]
// }));

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/fetchMessages',  // Define the route with params
            handler: 'chat.findMessagesBetweenUsers',      // This should match the controller function
            config: {
                // auth: false, // Add authentication if needed
            }
        },
        {
            method: 'POST',
            path: '/sendMessage',  // The route for adding a message
            handler: 'chat.sendMessage',  // The controller method that handles sending a message
            config: {
                // auth: true,  // Optional, if you need authentication for sending messages
            },
        },
        {
            method: 'POST',
            path: '/checkUserEmail',  // The route for checking if a user exists
            handler: 'chat.checkUserEmail',  // The controller method that handles checking if a user exists
            config: {
                middlewares: ['global::headerValidation'],
                // auth: true,  // Optional, if you need authentication for checking if a user exists
            },
        },
    ]
}