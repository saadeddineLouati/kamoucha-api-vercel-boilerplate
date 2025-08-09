const passport = require('passport');
const requestIp = require('request-ip');

const setCurrentUser = (req, resolve) => async (err, user) => {
  let ip = req.headers['x-client-ip'];
  if (!ip) ip = requestIp.getClientIp(req);
  if (user) req.user = user;
  req.clientIp = ip;
  resolve();
};

const currentUserMiddelware =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, setCurrentUser(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = currentUserMiddelware;
