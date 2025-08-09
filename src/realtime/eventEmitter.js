const EventEmitter = require('events');

const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(1);

module.exports = eventEmitter;
