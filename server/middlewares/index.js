const authMiddleware = require('./auth.middleware');
const validateUserData = require('./validationUser.middleware');
const errorMiddleware = require('./error.middleware');

module.exports = {
  authMiddleware,
  validateUserData,
  errorMiddleware
};