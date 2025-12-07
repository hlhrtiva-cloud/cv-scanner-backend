// api/extract.js
const { verifyLicense } = require("../services/licenseService");
const { extractWithGemini } = require("../services/geminiService");

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
    cvText,
    jdText,
    locale
  } = body;

  if (!licenseKey || !sheetId || !cvText) {
    res.status(400).json({
      ok: false,
      code: "MISSING_PARAMS",
      message: "licenseKey, sheetId, cvText are required."
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

  // 2) Tạm dùng mockExtract (chưa gọi Gemini)
  const data = mockExtract(cvText, jdText || "");

  res.status(200).json({
    ok: true,
    data,
    usage: {
      model: "mock",
      promptTokens: 0,
      completionTokens: 0
    },
    cache: {
      hit: false
    }
  });
};
