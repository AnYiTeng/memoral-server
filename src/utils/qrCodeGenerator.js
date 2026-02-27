function formatDateTo8Digits(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}${month}${day}`;
}

function generateRandom4Digits() {
  return `${Math.floor(Math.random() * 10000)}`.padStart(4, '0');
}

function generateQrCodeId() {
  const now = new Date();
  const datePart = formatDateTo8Digits(now);
  const randomPart = generateRandom4Digits();
  return `QR_${datePart}_${randomPart}`;
}

module.exports = {
  generateQrCodeId,
};

