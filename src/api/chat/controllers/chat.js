'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

// Set up Socket.io
const io = new Server(strapi.server.httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const users = {};
io.on('connection', (socket) => {
    socket.on('join', (userId) => {
        users[userId] = socket.id;
    });

    socket.on('disconnect', () => {
        Object.keys(users).forEach((key) => {
            if (users[key] === socket.id) {
                delete users[key];
            }
        });
    });
});

module.exports = createCoreController('api::chat.chat', ({ strapi }) => ({
    async findMessagesBetweenUsers(ctx) {
        try {
            const { user1, user2 } = ctx.query;
            const userId = ctx.state.user.id;
            if(user1 != userId && user2 != userId){
                return ctx.badRequest('You are not authorized to view these messages.');
            } 
            if (!user1 || !user2) {
                return ctx.badRequest('Both user1 and user2 are required.');
            }

            const messages = await strapi.db.query('api::chat.chat').findMany({
                where: {
                    $or: [
                        { sender: user1, receiver: user2 },
                        { sender: user2, receiver: user1 },
                    ],
                },
                orderBy: { timestamp: 'asc' },
                populate: ['sender', 'receiver'],
            });

            return ctx.send(messages);
        } catch (error) {
            strapi.log.error('Error fetching messages:', error);
            return ctx.internalServerError('Failed to fetch messages.');
        }
    },

    async sendMessage(ctx) {
        try {

            const { sender, receiver, message } = ctx.request.body;
            if (!sender || !receiver || !message) {
                return ctx.badRequest('Sender, receiver, and message are required.');
            }

            const newMessage = await strapi.db.query('api::chat.chat').create({
                data: {
                    sender,
                    receiver,
                    message,
                    timestamp: new Date(),
                },
                populate: {
                    sender: true,
                    receiver: true,
                },
            });

            if (users[receiver]) {
                io.to(users[receiver]).emit('message', newMessage);
            }

            return ctx.send(newMessage);
        } catch (error) {
            strapi.log.error('Error sending message:', error);
            return ctx.internalServerError('Failed to send the message.');
        }
    },

    async na(ctx) {
        console.log('enter');
        return ctx.send({ userId: 1 });
    },

    async checkUserEmail(ctx) {

        try {

            const { email } = ctx.request.body;
            if (!email) {
                return ctx.badRequest('Email is required.');
            }

            const user = await strapi.db.query('plugin::users-permissions.user').findOne({
                where: { email },
            });

            return ctx.send({ userId: user ? user.id : null });
        } catch (error) {
            strapi.log.error('Error checking user email:', error);
            return ctx.internalServerError('Failed to check email.');
        }
    },
}
));
