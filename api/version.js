module.exports = (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, message: "Method not allowed" });
    return;
  }

  res.status(200).json({
    ok: true,
    product: "cv-scanner-pro",
    latestVersion: "3.1.0",
    minClientVersion: "3.1.0",
    updateRequired: false,
    changelog: [
      "Tích hợp Gemini 2.5 Flash",
      "Thêm license + quota",
      "Auto update system"
    ]
  });
};
