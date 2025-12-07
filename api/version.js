// api/version.js

module.exports = (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, message: "Method not allowed" });
    return;
  }

  const product = req.query.product || "cv-scanner-pro";
  const clientVersion = req.query.clientVersion || null;

  res.status(200).json({
    product,
    latestVersion: "0.0.1",
    minClientVersion: "0.0.1",
    updateRequired: false,
    changelog: [
      "Initial backend skeleton deployed on Vercel."
    ],
    downloadUrl: null
  });
};
