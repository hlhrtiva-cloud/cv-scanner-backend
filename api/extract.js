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
  const { licenseKey, sheetId, cvText, jdText } = body;

  if (!licenseKey || !sheetId || !cvText) {
    res.status(400).json({
      ok: false,
      code: "MISSING_PARAMS",
      message: "licenseKey, sheetId, cvText are required."
    });
    return;
  }

  const licResult = verifyLicense(licenseKey, sheetId, true);

  if (!licResult.valid) {
    res.status(200).json({
      ok: false,
      code: licResult.reason || "LICENSE_INVALID",
      message: "License không hợp lệ hoặc đã hết hạn."
    });
    return;
  }

  // RUN GEMINI REAL
  const data = await extractWithGemini(cvText, jdText || "");

  res.status(200).json({
    ok: true,
    data,
    usage: {
      model: "gemini-2.5-flash"
    },
    cache: { hit: false }
  });
};
