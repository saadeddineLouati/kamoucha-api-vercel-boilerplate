const NodeCache = require('node-cache');

const cache = new NodeCache();

function cacheMiddleware(duration = 60) {
  return function (req, res, next) {
    const key = req.originalUrl || req.url;
    const cachedData = cache.get(key);

    if (cachedData) {
      return res.send(cachedData);
    }

    res.sendResponse = res.send;
    res.send = (body) => {
      cache.set(key, body, duration);
      res.sendResponse(body);
    };
    next();
  };
}

module.exports = cacheMiddleware;
