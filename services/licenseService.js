const fs = require("fs");
const path = require("path");

const LICENSES_FILE = path.join(__dirname, "..", "data", "licenses.json");

function loadLicenses() {
  return JSON.parse(fs.readFileSync(LICENSES_FILE, "utf8"));
}

function saveLicenses(data) {
  fs.writeFileSync(LICENSES_FILE, JSON.stringify(data, null, 2), "utf8");
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function verifyLicense(licenseKey, sheetId, increment = false) {
  let licenses = loadLicenses();
  let lic = licenses.find(l => l.licenseKey === licenseKey && l.active);

  if (!lic) {
    return { valid: false, reason: "LICENSE_NOT_FOUND" };
  }

  let now = new Date();
  if (new Date(lic.expiresAt) < now) {
    return { valid: false, reason: "LICENSE_EXPIRED" };
  }

  if (!lic.usage) lic.usage = {};
  let today = getToday();
  let usedToday = lic.usage[today] || 0;

  if (usedToday >= lic.maxDailyCV) {
    return {
      valid: false,
      reason: "QUOTA_EXCEEDED",
      quota: {
        usedToday,
        limitToday: lic.maxDailyCV
      }
    };
  }

  if (increment) {
    lic.usage[today] = usedToday + 1;
    saveLicenses(licenses);
  }

  return {
    valid: true,
    customer: {
      name: lic.customerName,
      email: lic.email,
      plan: lic.plan,
      expiresAt: lic.expiresAt,
      maxDailyCV: lic.maxDailyCV
    },
    quota: {
      usedToday: lic.usage[today] || 0,
      limitToday: lic.maxDailyCV
    }
  };
}

module.exports = { verifyLicense };
