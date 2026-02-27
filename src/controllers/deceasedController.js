const {
  createDeceasedService,
  getDeceasedService,
  incrementScanCountService,
  verifyPasswordService,
} = require('../services/deceasedService');

async function createDeceased(req, res) {
  try {
    const result = await createDeceasedService(req.body);
    return res.status(200).json({
      code: 200,
      message: '创建成功',
      data: result,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('创建纪念页失败', err);
    const isProd = process.env.NODE_ENV === 'production';
    return res.status(500).json({
      code: 500,
      message: isProd ? '服务器内部错误' : `创建纪念页失败：${err.message || '未知错误'}`,
      ...(isProd
        ? {}
        : {
            error: {
              code: err.code,
              sqlState: err.sqlState,
              sqlMessage: err.sqlMessage,
            },
          }),
    });
  }
}

async function getDeceased(req, res) {
  const { qrCodeId } = req.params;
  try {
    const deceased = await getDeceasedService(qrCodeId);
    if (!deceased) {
      return res.status(404).json({
        code: 404,
        message: '未找到对应的纪念页',
      });
    }
    return res.status(200).json({
      code: 200,
      data: deceased,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('获取纪念页失败', err);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
    });
  }
}

async function incrementScanCount(req, res) {
  const { qrCodeId } = req.params;
  try {
    const newCount = await incrementScanCountService(qrCodeId);
    if (newCount === null) {
      return res.status(404).json({
        code: 404,
        message: '未找到对应的纪念页',
      });
    }
    return res.status(200).json({
      code: 200,
      message: '更新成功',
      data: {
        scan_count: newCount,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('更新扫码次数失败', err);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
    });
  }
}

async function verifyPassword(req, res) {
  const { qrCodeId } = req.params;
  const { password } = req.body;
  try {
    const result = await verifyPasswordService(qrCodeId, password);
    if (!result.exists) {
      return res.status(404).json({
        code: 404,
        message: '未找到对应的纪念页',
      });
    }
    if (!result.hasPassword) {
      return res.status(200).json({
        code: 200,
        message: '无需密码，允许访问',
        data: {
          verified: true,
          hasPassword: false,
        },
      });
    }
    if (!result.matched) {
      return res.status(401).json({
        code: 401,
        message: '密码错误',
        data: {
          verified: false,
          hasPassword: true,
        },
      });
    }
    return res.status(200).json({
      code: 200,
      message: '验证通过',
      data: {
        verified: true,
        hasPassword: true,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('验证密码失败', err);
    return res.status(500).json({
      code: 500,
      message: '服务器内部错误',
    });
  }
}

module.exports = {
  createDeceased,
  getDeceased,
  incrementScanCount,
  verifyPassword,
};

