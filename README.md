# Dating ❤️ — Backend API

Romantic date proposal website backend powered by Node.js, Express, MongoDB Atlas, and Nodemailer.

🔌 **Live API Endpoint:** [https://dating-backend-dusky.vercel.app](https://dating-backend-dusky.vercel.app)  
🌐 **Frontend Website:** [https://dating-frontend-sepia.vercel.app](https://dating-frontend-sepia.vercel.app)

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

## Vercel Deployment
- **Project Name:** `dating-backend`
- **Live URL:** [https://dating-backend-dusky.vercel.app](https://dating-backend-dusky.vercel.app)
- **Health Check:** [https://dating-backend-dusky.vercel.app/api/health](https://dating-backend-dusky.vercel.app/api/health)
