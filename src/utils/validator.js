const isValidDateString = (value) => {
  if (!value) return true;
  const date = new Date(value);
  // eslint-disable-next-line no-restricted-globals
  return !isNaN(date.getTime());
};

const isValidJsonArray = (value) => {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value)) return true;
  return false;
};

function validateDeceasedPayload(payload) {
  const errors = [];

  if (!payload.full_name || typeof payload.full_name !== 'string') {
    errors.push('full_name 为必填且必须是字符串');
  }

  if (payload.gender && !['male', 'female', 'other'].includes(payload.gender)) {
    errors.push('gender 必须是 male / female / other 之一');
  }

  if (payload.birth_date && !isValidDateString(payload.birth_date)) {
    errors.push('birth_date 日期格式不正确，必须是 YYYY-MM-DD');
  }

  if (payload.death_date && !isValidDateString(payload.death_date)) {
    errors.push('death_date 日期格式不正确，必须是 YYYY-MM-DD');
  }

  if (!isValidJsonArray(payload.photos)) {
    errors.push('photos 必须是字符串数组');
  }

  if (!isValidJsonArray(payload.videos)) {
    errors.push('videos 必须是字符串数组');
  }

  if (payload.is_public !== undefined && typeof payload.is_public !== 'boolean') {
    errors.push('is_public 必须是布尔值');
  }

  return errors;
}

function validatePasswordPayload(payload) {
  const errors = [];
  if (!payload.password || typeof payload.password !== 'string') {
    errors.push('password 为必填且必须是字符串');
  }
  return errors;
}

function validationMiddleware(req, res, next) {
  const errors = validateDeceasedPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      code: 400,
      message: '参数验证失败',
      errors,
    });
  }
  return next();
}

function passwordValidationMiddleware(req, res, next) {
  const errors = validatePasswordPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({
      code: 400,
      message: '参数验证失败',
      errors,
    });
  }
  return next();
}

module.exports = {
  validateDeceasedPayload,
  validatePasswordPayload,
  validationMiddleware,
  passwordValidationMiddleware,
};

