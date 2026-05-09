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
- MongoDB installed and running locally

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

