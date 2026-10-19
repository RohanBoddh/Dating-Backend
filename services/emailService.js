const nodemailer = require('nodemailer');

/**
 * Creates and returns Nodemailer transporter based on environment variables.
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const isConfigured =
    user &&
    pass &&
    !user.includes('your_email') &&
    !pass.includes('your_app_password');

  if (!isConfigured) {
    return {
      isMock: true,
      sendMail: async (mailOptions) => {
        console.log('\n💌 [SIMULATED EMAIL NOTIFICATION]');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`⚠️ NOTE: To send REAL emails to ${mailOptions.to}, set your 16-character Gmail App Password in backend/.env under SMTP_PASS!`);
        console.log(`Generate here (30 seconds): https://myaccount.google.com/apppasswords`);
        console.log(`Text summary:\n${mailOptions.text}`);
        console.log('--------------------------------------------------\n');
        return { messageId: 'simulated-mail-' + Date.now() };
      }
    };
  }

  // Optimize for Gmail if host is gmail or user has @gmail.com
  const isGmail = (host && host.includes('gmail')) || (user && user.endsWith('@gmail.com'));
  const cleanPass = pass.replace(/\s+/g, ''); // Handles "abcd efgh ijkl mnop" format automatically

  const transportOptions = isGmail
    ? {
        service: 'gmail',
        auth: {
          user,
          pass: cleanPass
        }
      }
    : {
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass: cleanPass
        },
        tls: {
          rejectUnauthorized: false
        }
      };

  const transporter = nodemailer.createTransport(transportOptions);
  return transporter;
}

/**
 * Format a Date object nicely into e.g. "Saturday, 24 October 2026"
 */
function formatDate(dateString) {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * Generates romantic HTML email template
 */
function generateEmailHtml(invitation) {
  const formattedDate = formatDate(invitation.date);
  const time = invitation.timePreference || 'Evening Dinner';
  const specialRequest = invitation.specialRequest
    ? invitation.specialRequest.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    : 'None (Just each other’s company 💕)';
  const confirmedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const senderName = invitation.senderName || 'Anonymous Date Partner 💕';
  const senderEmail = invitation.senderEmail || 'Not provided';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Date Confirmation</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: #fff0f5;
      color: #333333;
    }
    .wrapper {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(230, 57, 120, 0.15);
      border: 1px solid #ffd1dc;
    }
    .header {
      background: linear-gradient(135deg, #ff4d79 0%, #ff758c 50%, #ff8da1 100%);
      padding: 35px 25px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      letter-spacing: 0.5px;
      font-weight: 700;
    }
    .header p {
      margin: 10px 0 0;
      font-size: 16px;
      opacity: 0.95;
    }
    .user-highlight {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 10px;
      padding: 10px 14px;
      margin: 12px auto 0;
      display: inline-block;
      font-size: 15px;
    }
    .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.25);
      padding: 6px 16px;
      border-radius: 25px;
      font-size: 13px;
      margin-top: 10px;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: bold;
    }
    .content {
      padding: 30px 25px;
    }
    .greeting {
      font-size: 18px;
      color: #d81b60;
      font-weight: 600;
      margin-bottom: 20px;
      text-align: center;
    }
    .card {
      background: #fff8f9;
      border: 1px solid #ffe1e8;
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 25px;
    }
    .detail-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px dashed #ffd1dc;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .label {
      font-weight: bold;
      color: #880e4f;
      width: 150px;
      flex-shrink: 0;
    }
    .value {
      color: #333;
      flex-grow: 1;
    }
    .status-badge {
      display: inline-block;
      background: #e91e63;
      color: #fff;
      font-weight: bold;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
    }
    .footer {
      background: #fafafa;
      text-align: center;
      padding: 20px;
      color: #888888;
      font-size: 13px;
      border-top: 1px solid #f0f0f0;
    }
    .heart-icon {
      color: #e91e63;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>${senderName} Said YES! 💖</h1>
      <p>A lovely date has been confirmed on your website!</p>
      <div class="user-highlight">
        👤 <strong>${senderName}</strong> &nbsp;|&nbsp; 📧 <a href="mailto:${senderEmail}" style="color: #fff; text-decoration: underline;">${senderEmail}</a>
      </div>
      <br>
      <div class="badge">Invitation ID: ${invitation.invitationId}</div>
    </div>
    <div class="content">
      <div class="greeting">
        🎉 Rohan, ${senderName} accepted your date invitation!
      </div>
      <div class="card">
        <div class="detail-row">
          <div class="label">👤 Real Name:</div>
          <div class="value"><strong>${senderName}</strong></div>
        </div>
        <div class="detail-row">
          <div class="label">📧 User Email (Gmail):</div>
          <div class="value"><strong><a href="mailto:${senderEmail}" style="color: #e91e63; text-decoration: none;">${senderEmail}</a></strong></div>
        </div>
        <div class="detail-row">
          <div class="label">🍽️ Restaurant/Vibe:</div>
          <div class="value"><strong>${invitation.restaurantName}</strong></div>
        </div>
        <div class="detail-row">
          <div class="label">📅 Date:</div>
          <div class="value"><strong>${formattedDate}</strong></div>
        </div>
        <div class="detail-row">
          <div class="label">⏰ Time Slot:</div>
          <div class="value">${time}</div>
        </div>
        <div class="detail-row">
          <div class="label">💌 Special Note:</div>
          <div class="value">${specialRequest}</div>
        </div>
        <div class="detail-row">
          <div class="label">📌 Status:</div>
          <div class="value"><span class="status-badge">DATE CONFIRMED ❤️</span></div>
        </div>
        <div class="detail-row">
          <div class="label">🕒 Confirmed At:</div>
          <div class="value">${confirmedAt}</div>
        </div>
      </div>
      <p style="text-align: center; color: #555; line-height: 1.6; font-size: 14px;">
      <p style="text-align: center; margin-top: 18px;">
        <a href="https://dating-frontend-sepia.vercel.app" style="display: inline-block; background: #e91e63; color: #ffffff; text-decoration: none; padding: 10px 22px; border-radius: 25px; font-weight: bold; font-size: 14px;">Visit Dating Website 💖</a>
      </p>
    </div>
    <div class="footer">
      Sent with <span class="heart-icon">❤️</span> from the <a href="https://dating-frontend-sepia.vercel.app" style="color: #ff477e; text-decoration: none; font-weight: bold;">Dating</a> Web Application.
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send date confirmation notification email.
 */
async function sendDateConfirmationEmail(invitation) {
  const recipient = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER;

  if (!recipient || recipient.includes('your_email')) {
    console.warn('⚠️ [EmailService] NOTIFICATION_EMAIL is not configured. Email notification skipped.');
    return {
      success: false,
      isSimulated: true,
      message: 'NOTIFICATION_EMAIL is not configured in .env'
    };
  }

  const transporter = createTransporter();
  const formattedDate = formatDate(invitation.date);
  const senderName = invitation.senderName || 'Anonymous Date Partner 💕';
  const senderEmail = invitation.senderEmail || 'Not provided';

  const mailOptions = {
    from: `"${senderName} via Dating ❤️" <${process.env.SMTP_USER || 'no-reply@dating.local'}>`,
    replyTo: invitation.senderEmail ? `"${senderName}" <${invitation.senderEmail}>` : undefined,
    to: recipient,
    subject: `❤️ ${senderName} (${senderEmail}) Said YES! New Date Confirmed!`,
    text: `${senderName} Said YES! 💖\n\nDate confirmation received on Dating Web App!\n\n👤 Real Name: ${senderName}\n📧 Email (Gmail): ${senderEmail}\n🎟️ Invitation ID: ${invitation.invitationId}\n🍽️ Restaurant/Vibe: ${invitation.restaurantName}\n📅 Date: ${formattedDate}\n⏰ Time Preference: ${invitation.timePreference || 'Evening Dinner'}\n💌 Special Request: ${invitation.specialRequest || 'None'}\n📌 Status: CONFIRMED ❤️\n\nLive Website: https://dating-frontend-sepia.vercel.app\n`,
    html: generateEmailHtml(invitation)
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [EmailService] Confirmation email sent successfully. Msg ID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      isSimulated: Boolean(transporter.isMock)
    };
  } catch (error) {
    console.error(`❌ [EmailService] Failed to send email: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  sendDateConfirmationEmail
};
