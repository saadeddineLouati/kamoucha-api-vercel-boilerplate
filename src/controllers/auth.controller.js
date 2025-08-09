const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const ApiError = require('../utils/ApiError');
const { getReferralBonus } = require('../utils/scoreComputing');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  await tokenService.generateAuthTokens({ ...user, id: user._id });
  const verifyEmailToken = await tokenService.generateVerifyEmailToken({ ...user, id: user._id });
  await emailService.sendVerificationEmail(user.email, verifyEmailToken, req.get('origin'));
  res.status(httpStatus.CREATED).send({ user: user._id });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ ...tokens, user });
});

const loginWithGoogle = catchAsync(async (req, res) => {
  const { googleToken, referralCode } = req.body;
  const result = await authService.loginUserWithGoogle(googleToken, referralCode);
  res.send(result);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken, req.get('origin'));
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.get('origin'));
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  const user = await authService.verifyEmail(req.query.token);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ ...tokens, user });
});

const getLoggedUser = catchAsync(async (req, res) => {
  let currentUser = null;
  const bearerHeader = req.headers.authorization;
  let bearerToken;
  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    bearerToken = bearer[1];
  }
  const decoded = jwt.decode(bearerToken, process.env.JWT_SECRET);
  currentUser = await userService.getUserById(decoded.sub);
  res.status(200).send(currentUser);
});

const verifyReferalCode = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.referralCode);
  if (!user && user.isDeleted) throw new ApiError(httpStatus.NOT_FOUND, 'Code de parrainage invalide');
  res.send({ name: user.name, imgUrl: user.imgUrl, isTrusted: user.isTrusted, bonus: getReferralBonus(user) });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  getLoggedUser,
  loginWithGoogle,
  verifyReferalCode,
};
