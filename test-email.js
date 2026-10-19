const path = require('path');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config({ path: path.join(__dirname, '.env') });

const user = process.env.SMTP_USER;
const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
const to = process.env.NOTIFICATION_EMAIL || user;

console.log('--------------------------------------------------');
console.log('Testing Email Configuration for:', to);
console.log('SMTP User:', user);
console.log('SMTP Pass Length:', pass.length);
console.log('--------------------------------------------------');

if (!pass || pass.includes('your_app_password')) {
  console.error('❌ ERROR: SMTP_PASS is still placeholder text.');
  console.error('Please generate a 16-character App Password at: https://myaccount.google.com/apppasswords');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass
  }
});

async function runTest() {
  try {
    console.log('⏳ Connecting to Gmail SMTP servers...');
    await transporter.verify();
    console.log('✅ Authentication successful! Transporter verified.');

    console.log(`⏳ Sending test date confirmation email to ${to}...`);
    const info = await transporter.sendMail({
      from: `"Dating ❤️" <${user}>`,
      to: to,
      subject: '❤️ Test Email: Dating Website Notification',
      text: 'Congratulations! Your email notification setup is 100% working! 💖',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border-radius: 12px; background: #fff0f5; border: 1px solid #ffccd5; max-width: 500px;">
          <h2 style="color: #d81b60;">🎉 Email Setup Successful!</h2>
          <p>Bhai, aapka email setup bilkul sahi ho gaya hai!</p>
          <p>Ab jab bhi date confirm hogi, turant <strong>${to}</strong> par notification aayega! ❤️</p>
        </div>
      `
    });

    console.log('🎉 EMAIL SENT SUCCESSFULLY!');
    console.log('Message ID:', info.messageId);
    console.log('Check your Gmail inbox (and Spam folder just in case)!');
  } catch (err) {
    console.error('❌ FAILED TO SEND EMAIL:', err.message);
    if (err.message.includes('535') || err.message.includes('Username and Password not accepted')) {
      console.error('\n👉 Reason: Google rejected the password. Make sure you use a 16-character App Password from: https://myaccount.google.com/apppasswords');
    }
  }
}

runTest();
