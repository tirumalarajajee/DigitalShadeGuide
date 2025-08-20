import { createHmac } from "node:crypto";

function generateLicenseToken(orderId, deviceId) {
  const SECRET_KEY = process.env.SECRET_KEY;
  const issuedAt = Date.now();
  const payload = `${orderId}|${deviceId}|${issuedAt}`;

  const signature = createHmac("sha256", SECRET_KEY).update(payload).digest("hex");

  return Buffer.from(`${payload}|${signature}`).toString("base64");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId, deviceId } = req.body;

  if (!orderId || !deviceId) {
    return res.status(400).json({ error: "Missing orderId or deviceId" });
  }

  try {
    const licenseToken = generateLicenseToken(orderId, deviceId);
    res.status(200).json({ success: true, licenseToken });
    localStorage.setItem("licenseToken", licenseToken);
    
  } catch (err) {
    console.error("License generation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
