const express = require('express');
const {
  createDeceased,
  getDeceased,
  incrementScanCount,
  verifyPassword,
} = require('../controllers/deceasedController');
const {
  validationMiddleware,
  passwordValidationMiddleware,
} = require('../utils/validator');

const router = express.Router();

// 创建纪念页
router.post('/api/deceased', validationMiddleware, createDeceased);

// 根据二维码 ID 获取逝者信息
router.get('/api/deceased/:qrCodeId', getDeceased);

// 扫码计数
router.put('/api/deceased/:qrCodeId/scan', incrementScanCount);

// 验证访问密码
router.post('/api/deceased/:qrCodeId/verify', passwordValidationMiddleware, verifyPassword);

module.exports = router;

