module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::cors',
    config: {
      origin: '*', // Your frontend URL
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
      headers: ['Content-Type', 'Authorization', 'X-Requested-With', 'ngrok-skip-browser-warning'],
      credentials: true,
    },
  },
];
