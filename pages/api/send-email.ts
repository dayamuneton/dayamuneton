import type { NextApiRequest, NextApiResponse } from "next";
import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";
import { isTestSite } from "@/config/site-environment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
   }
   const { name, email, message, anonymously } = req.body ?? {};
   if (typeof name !== "string" || typeof email !== "string" ||
       typeof message !== "string" || !message.trim() || message.length > 10_000) {
      return res.status(400).json({ error: "Invalid message" });
   }
   if (isTestSite) return res.status(200).json({ accepted: true, local: true });

   const clientId = process.env.GOOGLE_APIS_CLIENT_ID;
   const clientSecret = process.env.GOOGLE_APIS_CLIENT_SECRET;
   const refreshToken = process.env.GOOGLE_APIS_REFRESH_TOKEN;
   const redirectUri = process.env.GOOGLE_APIS_REDIRECT_URI;
   const user = process.env.SMTP_TRANSPORT_USER;
   if (!clientId || !clientSecret || !refreshToken || !user) {
      return res.status(503).json({ error: "Email is unavailable" });
   }

   try {
      const client = new OAuth2Client({ clientId, clientSecret, redirectUri });
      client.setCredentials({ refresh_token: refreshToken });
      const { token: accessToken } = await client.getAccessToken();
      if (!accessToken) return res.status(502).json({ error: "Email is unavailable" });

      const mailer = nodemailer.createTransport({
         service: "gmail",
         auth: { type: "OAuth2", user, clientId, clientSecret, refreshToken, accessToken },
      });
      await mailer.sendMail({
         from: user,
         to: user,
         subject: `Message from ${name} (${email})`,
         text: `${anonymously ? "MENSAJE ANONIMO!!!\n" : ""} ${message}`,
      });
      return res.status(200).json({ accepted: true });
   } catch {
      return res.status(502).json({ error: "Could not send the message. Try again." });
   }
}
