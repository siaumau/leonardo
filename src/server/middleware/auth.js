const { logger } = require('../../utils/logger');

// 移除本地 token 驗證，直接通過所有請求
const authMiddleware = (req, res, next) => {
  next();
};

module.exports = { authMiddleware };
