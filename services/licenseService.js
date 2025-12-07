// services/licenseService.js
const path = require("path");
const fs = require("fs");

const LICENSES_FILE = path.join(__dirname, "..", "data", "licenses.json");

function loadLicenses() {
  const raw = fs.readFileSync(LICENSES_FILE, "utf8");
  return JSON.parse(raw);
}

function verifyLicense(licenseKey, sheetId) {
  const licenses = loadLicenses();
  const license = licenses.find(
    (lic) => lic.licenseKey === licenseKey && lic.active
  );

  if (!license) {
    return {
      valid: false,
      reason: "LICENSE_NOT_FOUND"
    };
  }

  const now = new Date();
  const expiresAt = new Date(license.expiresAt);
  if (expiresAt < now) {
    return {
      valid: false,
      reason: "LICENSE_EXPIRED"
    };
  }

  // Ở đây bước sau có thể track usage theo sheetId
  return {
    valid: true,
    customer: {
      name: license.customerName,
      email: license.email,
      plan: license.plan,
      expiresAt: license.expiresAt,
      maxDailyCV: license.maxDailyCV
    },
    quota: {
      usedToday: 0,
      limitToday: license.maxDailyCV
    }
  };
}

module.exports = {
  verifyLicense
};
