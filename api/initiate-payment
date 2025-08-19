// File: /api/initiate-payment.js

import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId, amount, deviceId } = req.body;

  const ACCOUNT_ID = process.env.ACCOUNT_ID;
  const SECRET_KEY = process.env.SECRET_KEY;

  const payloadStr = `${ACCOUNT_ID}|${orderId}|${amount}|${deviceId}`;
  const hash = crypto.createHmac("sha256", SECRET_KEY).update(payloadStr).digest("hex");

  const paymentUrl = `https://zeroith.in/pay?order_id=${orderId}&hash=${hash}`;
  res.status(200).json({ paymentUrl });
}
