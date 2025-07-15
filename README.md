# SkillConnect – Backend

SkillConnect is a MERN stack-based peer-learning and mentorship platform that fosters collaborative learning among students and developers. This repository contains the **backend code**, built using **Node.js**, **Express.js**, and **MongoDB**.

## 🌐 Live Frontend  
👉 [SkillConnect Frontend](https://skillconnect-frontend-ten.vercel.app)

---

## 🚀 Features

- ✅ User authentication (JWT-based login & signup)
- 🔐 Protected routes via middleware
- 📚 Public rooms with roadmap-based thread discussions
- 🔒 Private manual rooms (joined via unique Room ID)
- 🧵 Thread and reply system for doubt discussions
- 📄 Note sharing and deletion via AWS S3
- 💬 (Planned) Chat feature inside manual rooms

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT, Bcrypt
- **File Upload**: AWS S3
- **Cookie & CORS Handling**: Secure in production

---

## 📁 Project Structure

```
skillconnect-backend/
│
├── controllers/        # Route handlers
├── models/             # Mongoose schemas
├── routes/             # API route definitions
├── middleware/         # Authentication middleware
├── config/             # DB and AWS S3 configuration
├── uploads/            # (optional) local uploads
├── server.js           # Application entry point
└── .env                # Environment variables
```

---

## ⚙️ Getting Started

### ✅ Prerequisites

- Node.js >= 16.x
- MongoDB (Atlas or Local)
- AWS S3 Bucket and credentials

### 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/Deepro111/skillconnect-backened.git
cd skillconnect-backened
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=your_aws_region
NODE_ENV=development
SMTP_USER=your_smtp_userid
SMTP_PASS = smtp_password
SENDER_EMAIL = your_email
```

4. Start the server:

```bash
npm run dev
```

Server will start on `http://localhost:5000`

---

## 📦 API Endpoints

| Method | Endpoint                     | Description                      |
|--------|------------------------------|----------------------------------|
| POST   | `/api/auth/register`         | Register a new user              |
| POST   | `/api/auth/login`            | Login user                       |
| POST   | `/api/auth/logout`           | Logout user                      |
| POST   | `/api/auth/send-verify-otp`  | OTP send for verification        |
| POST   | `/api/auth/verify-account`   | verify user's account            |
| POST   | `/api/auth/is-auth`          | check if user is authenticated   |
| POST   | `/api/auth/send-reset-otp`   | to send password reset OTP       |
| POST   | `/api/auth/reset-password`   | Reset Password                   |
| POST   | `/api/manual-rooms/create`   | Create a manual room             |
| POST   | `/api/manual-rooms/join`     | Join a manual room via Room ID   |
| GET    | `/api/threads/:topicId`      | Get threads for the topic        |
| POST   | `/api/threads/`              | Create a new thread              |
| POST   | `/api/threads/reply`         | Reply to a thread                |
| GET    | `/api/threads/:topicId`      | Get all threads for a topic      |
| POST   |`/api/manual-rooms/:roomId/upload`| Upload a note to AWS S3      |
| POST   | `/api/manual-rooms/:roomId/delete-note`| Delete a note by ID   |

> More routes and docs will be added soon.

---

## 🧪 Testing

Use tools like **Postman** or **Thunder Client** to test API endpoints.  
Make sure to include JWT tokens in headers for protected routes.

---

## 🚀 Deployment Tips

- Use **Render**, **Railway**, or similar platforms to host the backend
- Set `NODE_ENV=production` for proper cookie handling
- Configure CORS and cookies carefully when connecting with frontend

---

## 🙋 Author

**Deepro**  
GitHub: [@Deepro111](https://github.com/Deepro111)

---
