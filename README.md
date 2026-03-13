# 💬 Real-Time Chat Application (Frontend)

A modern real-time chat application built with **React.js** and **Socket.io**.  
This project allows users to sign up, log in, and chat instantly in real time.

---

## 🌟 Features

- ✅ User Signup & Login
- ✅ JWT Authentication
- ✅ Real-Time Messaging (Socket.io)
- ✅ Private One-to-One Chat
- ✅ Chat History
- ✅ Toast Notifications
- ✅ Responsive UI
- ✅ Clean & Modern Design

---

## 🛠️ Tech Stack

- React.js
- Socket.io-client
- Axios
- MDB React UI Kit
- React Toastify
- React Router DOM
- JWT Authentication

---

## 📁 Project Structure

```
src/
│
├── App.js        (Signup Page)
├── Login.js      (Login Page)
├── Chat.js       (Main Chat Screen)
├── chat.css
└── ...
```

---

## 🚀 How It Works

### 1️⃣ Signup
- User enters:
  - Username
  - Phone Number
  - Password
- Data is sent to backend API.
- After successful signup → Redirect to Login.

---

### 2️⃣ Login
- User enters:
  - Username
  - Password
- Backend returns JWT token.
- Token is saved in localStorage.
- Redirect to Chat page.

---

### 3️⃣ Real-Time Chat
- Socket connection is created.
- User joins using their user_id.
- Messages are:
  - Sent using `socket.emit("send-message")`
  - Received using `socket.on("receive-message")`
- Chat history is fetched from backend.

---

## 🔐 Authentication Flow

Token is stored like this:

```js
localStorage.setItem("token", access_token);
```

Token is sent in headers:

```js
Authorization: Bearer <token>
```

User ID is extracted from token.

---

## ⚡ Socket Events Used

- join
- send-message
- receive-message

Socket connection:

```js
const socket = io("https://chat-backend-0b9w.onrender.com");
```

---

## 🔗 Backend API

Base URL:
```
https://chat-backend-0b9w.onrender.com
```

### Auth Routes
- POST /api/signup
- POST /api/login

### Users
- GET /api/users

### Messages
- GET /api/messages/:receiverId

---

## 📦 Installation

1. Clone repository

```
git clone <your-repo-link>
```

2. Install dependencies

```
npm install
```

3. Run project

```
npm start
```

---

## 🔮 Future Improvements

- Online/Offline Status
- Typing Indicator
- Image Sharing
- Group Chat
- Dark Mode
- Profile Pictures
- Mobile Optimization

---

## 👨‍💻 Author

Developed using React + Socket.io 🚀

---

## 📄 License

This project is open-source and free to use.
