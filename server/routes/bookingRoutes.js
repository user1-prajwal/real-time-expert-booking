const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const { createBooking, getBookingsByEmail, updateBookingStatus } = require('../controllers/bookingController');

const bookingValidation = [
  body('expertId').notEmpty().withMessage('Expert ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('timeSlot').notEmpty().withMessage('Time slot is required'),
];

router.post('/',              bookingValidation, createBooking);
router.get('/',               getBookingsByEmail);
router.patch('/:id/status',   updateBookingStatus);

module.exports = router;