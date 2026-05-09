const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  date: { type: String, required: true },       // e.g. "2025-05-11"
  time: { type: String, required: true },       // e.g. "10:00 AM"
  isBooked: { type: Boolean, default: false },
});

const expertSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  category:   { type: String, required: true },
  experience: { type: Number, required: true }, // in years
  rating:     { type: Number, required: true, min: 1, max: 5 },
  bio:        { type: String },
  image:      { type: String },
  timeSlots:  [timeSlotSchema],
}, { timestamps: true });

module.exports = mongoose.model('Expert', expertSchema);