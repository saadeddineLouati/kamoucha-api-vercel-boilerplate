#!/usr/bin/env node
const http = require('http');
const cron = require('node-cron');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const eventEmitter = require('./realtime/eventEmitter');
const { notificationService } = require('./services');
const DailyCronsHandler = require('./crons/DailyCronsHandler');
// const { recover } = require('./scripts/recover');
// const { ingestCatalogues } = require('./scripts/save-new-catalogues');
// const { updateScores } = require('./utils/update');
// const { scrapeWebsite } = require('./scripts/web-scrapper');

const server = http.createServer(app);

let loggedInUsers = [];

// Daily cron
cron.schedule('0 0 0 * * *', DailyCronsHandler);

const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CLIENT,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('join', async (token) => {
    const userId = jwt.decode(token, process.env.JWT_SECRET)?.sub;
    if (userId) {
      const user = {
        userId,
        id: socket.id,
      };
      loggedInUsers.push(user);
      const totalUnseenNotifications = await notificationService.getTotalUnseenNotifications(userId);
      io.to(socket.id).emit('new-notification', totalUnseenNotifications);
    }
  });

  socket.on('disconnect', () => {
    loggedInUsers = loggedInUsers.filter((user) => user.id !== socket.id);
  });
});

eventEmitter.on('new-notification', async (notification) => {
  const userSockets = loggedInUsers.filter((user) => String(user.userId) === String(notification.userId));
  const totalUnseenNotifications = await notificationService.getTotalUnseenNotifications(notification.userId);
  userSockets.forEach((socket) => {
    io.to(socket.id).emit('new-notification', totalUnseenNotifications);
  });
});

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server.listen(config.port, () => {
    // scrapeWebsite();
    // updateScores();
    // ingestCatalogues();
    // recover();
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  setTimeout(async () => {
    await server.stop();
    logger.info('Server Stopped!');
  }, 10000);
});
