// api/analyze.js
const { verifyLicense } = require("../services/licenseService");
const { mockAnalyze } = require("../services/aiEngine");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({
      ok: false,
      code: "METHOD_NOT_ALLOWED",
      message: "Only POST allowed"
    });
    return;
  }

  const body = req.body || {};
  const {
    licenseKey,
    sheetId,
    userEmail,
    cv,
    jdText,
    config
  } = body;

  if (!licenseKey || !sheetId || !cv) {
    res.status(400).json({
      ok: false,
      code: "MISSING_PARAMS",
      message: "licenseKey, sheetId, cv are required."
    });
    return;
  }

  // 1) Check license
  const licResult = verifyLicense(licenseKey, sheetId);
  if (!licResult.valid) {
    res.status(200).json({
      ok: false,
      code: licResult.reason || "LICENSE_INVALID",
      message: "License không hợp lệ hoặc đã hết hạn."
    });
    return;
  }

  // 2) Tạm mock analyze (chưa dùng Gemini)
  const data = mockAnalyze(cv, jdText || "");

  res.status(200).json({
    ok: true,
    data
  });
};
