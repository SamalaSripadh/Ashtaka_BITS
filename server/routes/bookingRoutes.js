const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/me', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);
router.put('/:id', protect, authorize('admin'), updateBookingStatus);

module.exports = router; 