const { generateQrCodeId } = require('../utils/qrCodeGenerator');
const deceasedModel = require('../models/deceasedModel');

async function createDeceasedService(payload) {
  let qrCodeId;
  let created;
  // 简单重试以避免极小概率的重复 qr_code_id
  // 依赖数据库唯一约束来保证最终唯一性
  // 最多尝试 5 次
  let retry = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    qrCodeId = generateQrCodeId();
    try {
      created = await deceasedModel.createDeceased({
        ...payload,
        qr_code_id: qrCodeId,
      });
      break;
    } catch (err) {
      if (err && err.code === 'ER_DUP_ENTRY' && retry < 5) {
        retry += 1;
      } else {
        throw err;
      }
    }
  }

  const deceased = await deceasedModel.getDeceasedByQrCodeId(qrCodeId);
  return {
    id: created.id,
    qr_code_id: qrCodeId,
    full_name: deceased.full_name,
    created_at: deceased.created_at,
  };
}

async function getDeceasedService(qrCodeId) {
  const deceased = await deceasedModel.getDeceasedByQrCodeId(qrCodeId);
  if (!deceased) {
    return null;
  }
  delete deceased.access_password;
  return deceased;
}

async function incrementScanCountService(qrCodeId) {
  const newCount = await deceasedModel.incrementScanCount(qrCodeId);
  return newCount;
}

async function verifyPasswordService(qrCodeId, password) {
  const result = await deceasedModel.verifyPassword(qrCodeId, password);
  return result;
}

module.exports = {
  createDeceasedService,
  getDeceasedService,
  incrementScanCountService,
  verifyPasswordService,
};

