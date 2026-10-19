# Dating ❤️ — Backend API

Romantic date proposal website backend powered by Node.js, Express, MongoDB Atlas, and Nodemailer.

## Features
- 💌 Date Invitation Creation & Persistence (MongoDB Atlas)
- 📧 Live Gmail Confirmation Notifications (Nodemailer)
- 🛡️ Helmet, CORS, and Express Rate Limiting
- ☁️ Vercel Serverless Ready

## Environment Variables
Configure these in your `.env` locally or in Vercel Project Settings > Environment Variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Local server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | Gmail address | `rohanboddh9@gmail.com` |
| `SMTP_PASS` | 16-char Gmail App Password | `vqpmcngaqkllpepc` |
| `NOTIFICATION_EMAIL` | Destination email | `rohanboddh9@gmail.com` |

## Local Development
```bash
npm install
node server.js
```

## Vercel Deployment
1. Import this repository in Vercel.
2. Add the environment variables above in **Settings > Environment Variables**.
3. Deploy!
