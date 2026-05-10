require('dotenv').config();
const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const cors       = require('cors');
const connectDB  = require('./config/db');
const expertRoutes  = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const errorHandler  = require('./middleware/errorHandler');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] }
});

// Make io accessible in controllers
app.set('io', io);

// ── Daily Cron Job — Rolling 7-day slots ──────────────────────
const cron   = require('node-cron');
const Expert = require('./models/Expert');

const times = [
  '09:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','02:00 PM','03:00 PM','04:00 PM'
];

const getLocalDateStr = (date) => {
  const year  = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day   = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

cron.schedule('0 0 * * *', async () => {
  try {
    const experts = await Expert.find();
    for (let expert of experts) {

      // Remove today and past slots
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expert.timeSlots = expert.timeSlots.filter(s => {
        const slotDate = new Date(s.date);
        slotDate.setHours(0, 0, 0, 0);
        return slotDate > today;
      });

      // Find latest future date
      const futureDates = expert.timeSlots.map(s => s.date).sort();
      const lastDate = futureDates.length > 0
        ? new Date(futureDates[futureDates.length - 1])
        : new Date(today);

      // Add one new day at the end
      const newDate = new Date(lastDate);
      newDate.setDate(newDate.getDate() + 1);
      const newDateStr = getLocalDateStr(newDate);

      const alreadyExists = expert.timeSlots.some(s => s.date === newDateStr);
      if (!alreadyExists) {
        times.forEach(time => {
          expert.timeSlots.push({ date: newDateStr, time, isBooked: false });
        });
      }

      await expert.save();
    }
    console.log('✅ Rolling slots updated successfully!');
  } catch (err) {
    console.error('❌ Slot update failed:', err.message);
  }
});
// ──────────────────────────────────────────────────────────────

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Routes
app.use('/experts',  expertRoutes);
app.use('/bookings', bookingRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));