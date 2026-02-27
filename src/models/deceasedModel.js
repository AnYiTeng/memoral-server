const pool = require('../config/database');

async function createDeceased(data) {
  const sql = `
    INSERT INTO deceased (
      qr_code_id,
      full_name,
      gender,
      birth_date,
      death_date,
      biography,
      photos,
      videos,
      access_password,
      is_public
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const photosJson = data.photos ? JSON.stringify(data.photos) : null;
  const videosJson = data.videos ? JSON.stringify(data.videos) : null;

  const [result] = await pool.execute(sql, [
    data.qr_code_id,
    data.full_name,
    data.gender || null,
    data.birth_date || null,
    data.death_date || null,
    data.biography || null,
    photosJson,
    videosJson,
    data.access_password || null,
    data.is_public !== undefined ? data.is_public : true,
  ]);

  return {
    id: result.insertId,
    qr_code_id: data.qr_code_id,
  };
}

function safeParseJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    // 只接受数组，其它类型一律视为空
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('解析 JSON 数组字段失败:', value, e);
    return [];
  }
}

async function getDeceasedByQrCodeId(qrCodeId) {
  const sql = `
    SELECT
      id,
      qr_code_id,
      full_name,
      gender,
      birth_date,
      death_date,
      biography,
      photos,
      videos,
      is_public,
      scan_count,
      created_at,
      updated_at,
      access_password
    FROM deceased
    WHERE qr_code_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(sql, [qrCodeId]);
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    ...row,
    photos: safeParseJsonArray(row.photos),
    videos: safeParseJsonArray(row.videos),
  };
}

async function incrementScanCount(qrCodeId) {
  const sql = `
    UPDATE deceased
    SET scan_count = scan_count + 1
    WHERE qr_code_id = ?
  `;
  const [result] = await pool.execute(sql, [qrCodeId]);
  if (result.affectedRows === 0) {
    return null;
  }

  const selectSql = `
    SELECT scan_count
    FROM deceased
    WHERE qr_code_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(selectSql, [qrCodeId]);
  if (rows.length === 0) return null;
  return rows[0].scan_count;
}

async function verifyPassword(qrCodeId, password) {
  const sql = `
    SELECT access_password
    FROM deceased
    WHERE qr_code_id = ?
    LIMIT 1
  `;
  const [rows] = await pool.execute(sql, [qrCodeId]);
  if (rows.length === 0) return { exists: false, matched: false, hasPassword: false };

  const storedPassword = rows[0].access_password;
  if (!storedPassword) {
    return { exists: true, matched: true, hasPassword: false };
  }

  const matched = storedPassword === password;
  return { exists: true, matched, hasPassword: true };
}

module.exports = {
  createDeceased,
  getDeceasedByQrCodeId,
  incrementScanCount,
  verifyPassword,
};

