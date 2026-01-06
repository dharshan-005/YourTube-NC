const fetch = require("node-fetch");

function getClientIp(req) {
  const xForwardedFor = req.headers["x-forwarded-for"];

    if (xForwardedFor) {
        return xForwardedFor.split(",")[0].trim();
    }
    return req.headers["x-real-ip"] || req.connection?.remoteAddress || req.ip || null;
}

async function getGeolocation(ip) {
  try {
    if (!ip || ip === "127.0.0.1" || ip.startsWith("::1")) return null;
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      city: data.city || null,
      region: data.region || data.region_code || null,
      country: data.country_name || null,
    };
  } catch (err) {
    console.error("Geolocation fetch failed:", err);
    return null;
  }
}

module.exports = {
  getClientIp,
  getGeolocation,
};