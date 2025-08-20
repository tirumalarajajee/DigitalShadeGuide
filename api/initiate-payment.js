// File: /api/initiate-payment.js

export default async function handler(req, res) {
 const allowedOrigins = [
    "https://digital-shade-guide.vercel.app",
    "https://digital-shade-guide-git-main-tirumalarajajees-projects.vercel.app"
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Respond with HTTP 200 OK
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { orderId, amount, deviceId } = req.body;


  const ACCOUNT_ID = process.env.ACCOUNT_ID;
  const SECRET_KEY = process.env.SECRET_KEY;
  console.log("Request body:", req.body);
  console.log("Env vars:", process.env.ACCOUNT_ID, process.env.SECRET_KEY);


  if (!ACCOUNT_ID || !SECRET_KEY) {
    console.error("Missing environment variables");
    return res.status(500).json({ error: "Missing credentials" });
  }

  try {
    const crypto = await import("node:crypto");
    const payloadStr = `${ACCOUNT_ID}|${orderId}|${amount}|${deviceId}`;

    const hash = crypto.createHmac("sha256", SECRET_KEY).update(payloadStr).digest("hex");
    console.log("Zerotize payload:", payloadStr);
    console.log("Generated hash:", hash);

    const paymentUrl = `https://zerotize.in/pay?order_id=${orderId}&hash=${hash}`;
    res.status(200).json({ paymentUrl });
  } catch (err) {
    console.error("Function error:", err);
    res.status(500).json({ error: "Internal server error" });
  }

}

