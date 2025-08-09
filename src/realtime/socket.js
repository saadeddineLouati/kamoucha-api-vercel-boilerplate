const jwt = require('jsonwebtoken');
const eventEmitter = require('./eventEmitter');

const socketHandler = (socket) => {
  socket.on('join', (token) => {
    const userId = jwt.decode(token, process.env.JWT_SECRET)?.sub;
    socket.join(userId);
  });

  eventEmitter.on('new-notification', (notification) => {
    socket.to(notification.userId).emit('new-notification', notification);
  });
};

module.exports = { socketHandler };
