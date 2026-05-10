# 🎯 Real-Time Expert Session Booking System

A full-stack web application that allows users to browse experts, book sessions in real-time, and track their bookings.

## 🛠 Tech Stack

- **Frontend:** React.js, React Router, Axios, Socket.io-client
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Real-time:** Socket.io

## ✨ Features

- 🔍 Search and filter experts by name and category
- 📄 Pagination on expert listing
- 📅 Real-time slot availability updates using Socket.io
- 🔒 Double booking prevention with atomic MongoDB operations
- ✅ Form validation on booking
- 📧 View bookings by email
- 🔄 Booking status flow — Pending → Confirmed → Completed
- 📅 Rolling 7-day slot system — slots automatically refresh daily, always showing next 7 days

## 📁 Folder Structure
```
real-time-expert-booking/
├── client/          
│   └── src/
│       ├── components/
│       └── pages/
└── server/          
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    └── middleware/
```
## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed locally OR MongoDB Atlas account

### Backend Setup
```bash
cd server
npm install
npm run seed       # fills database with dummy expert data
npm run dev        # starts server on http://localhost:5000
```

### Frontend Setup
```bash
cd client
npm install
npm start          # starts app on http://localhost:3000
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /experts | Get all experts (pagination + filter) |
| GET | /experts/:id | Get single expert with time slots |
| POST | /bookings | Create a new booking |
| PATCH | /bookings/:id/status | Update booking status |
| GET | /bookings?email= | Get bookings by email |

## ⚙️ Environment Variables

Create a `.env` file in the `server/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expert-booking
CLIENT_URL=http://localhost:3000
```

## 🎥 Demo
Video: https://youtu.be/_A3HWnrB4uE

## 🌐 Live Demo
- Frontend: https://expert-booking-client.vercel.app
- Backend API: https://expert-booking-api-cnpe.onrender.com

## 🔄 How Slots Work

Expert time slots automatically refresh every day at midnight:
- Today's slots are removed
- A new future day is added at the end
- Always shows exactly 7 days ahead
- Booked slots are never affected
- Powered by a daily cron job (node-cron)

## ⚠️ Note
- Backend is hosted on Render free tier.
- First load may take 30-60 seconds to wake up.
- Please wait if experts don't load immediately.

