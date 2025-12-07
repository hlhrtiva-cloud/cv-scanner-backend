// api/verify.js
const { verifyLicense } = require("../services/licenseService");

module.exports = (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({
      valid: false,
      reason: "METHOD_NOT_ALLOWED"
    });
    return;
  }

  let body = {};
  try {
    body = req.body || {};
  } catch (err) {
    // Vercel thường đã parse JSON, nhưng đề phòng:
    body = {};
  }

  const { licenseKey, sheetId } = body;

  if (!licenseKey || !sheetId) {
    res.status(400).json({
      valid: false,
      reason: "MISSING_PARAMS"
    });
    return;
  }

  const result = verifyLicense(licenseKey, sheetId);
  res.status(result.valid ? 200 : 200).json(result);
};
