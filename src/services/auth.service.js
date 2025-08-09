const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { getProfileInfo } = require('./google-auth.service');
const { User } = require('../models');
const { getReferralBonus } = require('../utils/scoreComputing');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) throw new ApiError(httpStatus.UNAUTHORIZED, 'Email ou mot de passe incorrect');
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password)) || (!user.isEmailVerified && user.role !== 'admin')) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email ou mot de passe incorrect');
  }
  return user;
};

/**
 * Login with google
 * @param {string} googleToken
 * @param {ObjectID} referralCode
 * @returns {Promise<User>}
 */
const loginUserWithGoogle = async (googleToken, referralCode = null) => {
  try {
    const profile = await getProfileInfo(googleToken);
    const user = await userService.getUserByEmail(profile.email);
    if (!user) {
      const userBody = {
        googleId: profile.sub,
        name: profile.name,
        firstname: profile.given_name,
        lastname: profile.family_name,
        email: profile.email,
        imgUrl: profile.picture,
        isEmailVerified: true,
      };
      if (referralCode) {
        const referralUser = await User.findById(referralCode);
        if (referralUser) userBody.score = getReferralBonus(referralUser);
      }
      const newUser = await userService.createUser(userBody);
      const tokens = await tokenService.generateAuthTokens(newUser);
      return { ...tokens, user: newUser };
    }
    const tokens = await tokenService.generateAuthTokens(user);
    return { ...tokens, user };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Échec de la connexion avec Google');
  }
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Non trouvé');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Veuillez vous authentifier');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'La réinitialisation du mot de passe a échoué');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    if (user.referralCode) {
      const subscriberFriend = await userService.getUserById(user.referralCode);
      if (subscriberFriend)
        await userService.updateUserById(user.referralCode, {
          score: (subscriberFriend.score || 0) + getReferralBonus(subscriberFriend),
        });
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    return await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "La vérification de l'adresse e-mail a échoué");
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  loginUserWithGoogle,
};
