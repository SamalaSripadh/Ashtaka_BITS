const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    req.body.user = req.user.id;

    // Check if event exists
    const event = await Event.findById(req.body.event);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if there are enough tickets available
    if (event.availableTickets < req.body.ticketCount) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    // Calculate total amount
    req.body.totalAmount = event.ticketPrice * req.body.ticketCount;

    // Create booking
    const booking = await Booking.create(req.body);

    // Update event's available tickets
    event.availableTickets -= req.body.ticketCount;
    await event.save();

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for a user
// @route   GET /api/bookings/me
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event')
      .sort('-bookingDate');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('event')
      .populate('user', 'name email')
      .sort('-bookingDate');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Admin only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking status
    booking.status = req.body.status;
    booking.paymentStatus = req.body.paymentStatus;
    await booking.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update event's available tickets
    const event = await Event.findById(booking.event);
    event.availableTickets += booking.ticketCount;
    await event.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 