const suspiciousUserAgents = ['bot', 'crawler', 'spider'];

const blockrequestsFromSuspiciousUserAgents = (req, res, next) => {
  const userAgent = req.get('User-Agent').toLowerCase();
  if (suspiciousUserAgents.some((agent) => userAgent.includes(agent))) {
    return res.status(403).send('Interdit');
  }

  next();
};

module.exports = { blockrequestsFromSuspiciousUserAgents };
