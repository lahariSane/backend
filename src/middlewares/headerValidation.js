module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    console.log('headerValidation middleware'); 
    // console.log(ctx);
    const authHeader = ctx.request.header.authorization;

    if (!authHeader) {
      return ctx.unauthorized('Authorization header is missing.');
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer"

    if (!token) {
      return ctx.unauthorized('JWT token is missing.');
    }

    try {
      const decoded = await strapi.plugins['users-permissions'].services.jwt.verify(token);
      ctx.state.user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: decoded.id },
      });

      if (!ctx.state.user) {
        return ctx.unauthorized('User not found.');
      }

      await next();
    } catch (err) {
      console.log(`err: ${err}`);
      return ctx.unauthorized('Invalid or expired JWT token.');
    }
  };
};
