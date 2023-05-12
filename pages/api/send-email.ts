import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import SMTPConnection from "nodemailer/lib/smtp-connection";

const clientId = process.env.GOOGLE_APIS_CLIENT_ID,
   clientSecret = process.env.GOOGLE_APIS_CLIENT_SECRET,
   refreshToken = process.env.GOOGLE_APIS_REFRESH_TOKEN,
   redirectUri = process.env.GOOGLE_APIS_REDIRECT_URI,
   user = process.env.SMTP_TRANSPORT_USER;

const OAuth2 = google.auth.OAuth2;
const oAuth2Client = new OAuth2(clientId, clientSecret, redirectUri);
oAuth2Client.setCredentials({
   refresh_token: refreshToken,
});

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse
) {
   try {
      const { name, email, message, anonymously } = req.body;

      const accessToken = await oAuth2Client.getAccessToken();

      if (!accessToken.token) {
         res.status(500).json({ error: "Could not get access token" });
         return;
      }

      const auth: SMTPConnection.AuthenticationTypeOAuth2 = {
         type: "OAuth2",
         user,
         clientId: clientId,
         clientSecret: clientSecret,
         refreshToken,
         accessToken: accessToken.token,
      };

      const transporter = nodemailer.createTransport({
         service: "gmail",
         auth,
      });

      const mailOptions = {
         from: user,
         to: user,
         subject: `Message from ${name} (${email})`,
         text: `${anonymously ? "MENSAJE ANONIMO!!! \n" : ""} ${message}`,
      };

      const sentMessageInfo = await transporter.sendMail(mailOptions);

      res.status(200).json(sentMessageInfo);
   } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
   }
}
