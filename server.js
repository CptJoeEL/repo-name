const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configure the recipient here. For local development with MailHog this can be any address.
// For real delivery set SMTP credentials below (or use environment variables) and the RECIPIENT_EMAIL.
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'cptjoeel@gmail.com';

// Transport configuration: default is MailHog at localhost:1025 for local testing.
// For real delivery set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (and optionally SMTP_SECURE=true).
const smtpHost = process.env.SMTP_HOST || 'localhost';
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 1025;
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASS || '';
const smtpSecure = (process.env.SMTP_SECURE === 'true') || smtpPort === 465;

const transportOptions = {
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
};

if (smtpUser && smtpPass) {
  transportOptions.auth = { user: smtpUser, pass: smtpPass };
}

const transporter = nodemailer.createTransport(transportOptions);

app.post('/send', async (req, res) => {
  try {
    const { sender_email, anonymous, message } = req.body;
    const fromText = anonymous ? 'Anonymous' : (sender_email || 'No email provided');

    const mail = {
      from: 'no-reply@valentine.local',
      to: RECIPIENT_EMAIL,
      subject: `Valentine response${anonymous ? ' (anonymous)' : ''}`,
      text: `Message: ${message || '(no message)'}\nFrom: ${fromText}`,
      replyTo: anonymous || !sender_email ? undefined : sender_email,
    };

    await transporter.sendMail(mail);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Send error', err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Local mail API listening on http://localhost:${PORT}`));

// Usage notes (in README or terminal):
// Run MailHog (Docker): docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
// Start server: node server.js
// MailHog UI: http://localhost:8025
