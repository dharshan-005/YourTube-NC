import fetch from "node-fetch";

function normalizeIp(ip) {
  if (!ip) return null;

  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }

  return ip;
}

function getClientIp(req) {
  let ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.ip ||
    req.connection?.remoteAddress ||
    null;

  return normalizeIp(ip);
}

async function getGeolocation(ip) {
  if (
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.")
  ) {
    return { city: "Localhost", region: null, country: null };
  }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);

    if (!res.ok) return null;

    const data = await res.json();

    return {
      city: data.city || "Unknown",
      region: data.region || data.region_code || null,
      country: data.country_name || null,
    };
  } catch (err) {
    console.error("Geolocation fetch failed:", err.message);
    return null;
  }
}

export { getClientIp, getGeolocation };
