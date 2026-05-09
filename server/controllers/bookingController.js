
const Booking = require('../models/Booking');
const Expert  = require('../models/Expert');
const { validationResult } = require('express-validator');

// POST /bookings
const createBooking = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { expertId, name, email, phone, date, timeSlot, notes } = req.body;

    // Atomic update — only updates if slot is NOT already booked
    // This prevents double booking without needing transactions
    const expert = await Expert.findOneAndUpdate(
      {
        _id: expertId,
        timeSlots: {
          $elemMatch: { date: date, time: timeSlot, isBooked: false }
        }
      },
      {
        $set: { 'timeSlots.$[slot].isBooked': true }
      },
      {
        arrayFilters: [{ 'slot.date': date, 'slot.time': timeSlot }],
        new: true
      }
    );

    // If expert is null, slot was already booked (race condition handled!)
    if (!expert) {
      return res.status(409).json({
        success: false,
        message: 'This slot is already booked. Please choose another.'
      });
    }

    // Create booking record
    const booking = await Booking.create({
      expert: expertId, name, email, phone, date, timeSlot, notes,
    });

    // Emit real-time event to all connected clients
    const io = req.app.get('io');
    io.emit('slotBooked', { expertId, date, timeSlot });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// GET /bookings?email=
const getBookingsByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email)
      return res.status(400).json({ success: false, message: 'Email is required' });

    const bookings = await Booking.find({ email })
      .populate('expert', 'name category')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

// PATCH /bookings/:id/status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Confirmed', 'Completed'].includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking)
      return res.status(404).json({ success: false, message: 'Booking not found' });

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

module.exports = { createBooking, getBookingsByEmail, updateBookingStatus };