const nodemailer = require('nodemailer');
const config = require('../config/config');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  // transport
  //   .verify()
  //   .then(() => logger.info('Connected to email server'))
  //   .catch((e) => {
  //     console.log(e);
  //     logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env');
  //   });
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token, origin) => {
  const subject = 'Réinitialiser votre mot de passe';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${origin}/reset-password?token=${token}`;
  const text = `Cher utilisateur,
  Pour réinitialiser votre mot de passe, cliquez sur ce lien: ${resetPasswordUrl}
  Si vous n'avez demandé aucune réinitialisation de mot de passe, ignorez cet e-mail.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token, origin) => {
  const subject = 'Vérification de votre E-mail';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${origin}/verify-email?token=${token}`;
  const text = `Cher utilisateur,
  Pour vérifier votre email, cliquez sur ce lien: ${verificationEmailUrl}
  Si vous n'avez pas créé de compte, ignorez cet e-mail.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
