const ContactMessage = require('../models/contact-message.model');

/**
 * Create a contactMessage
 * @param {Object} contactMessageBody
 * @returns {Promise<ContactMessage>}
 */
const createContactMessage = async (contactMessageBody) => {
  return ContactMessage.create(contactMessageBody);
};

module.exports.createContactMessage = createContactMessage;
